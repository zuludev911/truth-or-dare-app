import { AppState } from "react-native";
import {
  AdsConsent,
  AdsConsentPrivacyOptionsRequirementStatus,
} from "react-native-google-mobile-ads";
import * as Sentry from "@sentry/react-native";

const isNullActivityError = (error: unknown) =>
  String((error as Error)?.message ?? error).includes("Activity was null");

/** UMP necesita una pantalla (Activity) visible; espera a que la app esté en primer plano. */
const waitUntilActive = () =>
  new Promise<void>((resolve) => {
    if (AppState.currentState === "active") return resolve();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      subscription.remove();
      resolve();
    });
  });

/**
 * Pide el consentimiento de anuncios (UMP de Google) cuando aplica, por ejemplo
 * en la UE y Reino Unido. Fuera de esas regiones no muestra nada. Los SDK de
 * AdMob y Firebase Analytics leen la respuesta automáticamente.
 *
 * El formulario se configura en AdMob → Privacidad y mensajes.
 */
export const gatherConsent = async (): Promise<boolean> => {
  try {
    // Si Android arranca la app en segundo plano (o la Activity aún no está
    // lista), UMP falla con "the current Activity was null".
    await waitUntilActive();
    const info = await AdsConsent.gatherConsent().catch(async (error) => {
      if (!isNullActivityError(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500));
      return AdsConsent.gatherConsent();
    });
    return info.canRequestAds;
  } catch (error) {
    console.warn("Consent gathering failed:", error);
    if (!isNullActivityError(error)) Sentry.captureException(error);
    // Si falla (p. ej. sin internet) intentamos igual: el SDK respeta el
    // último consentimiento guardado.
    const info = await AdsConsent.getConsentInfo().catch(() => null);
    return info?.canRequestAds ?? true;
  }
};

/** Algunas regiones exigen un acceso permanente para cambiar el consentimiento. */
export const isPrivacyOptionsRequired = async (): Promise<boolean> => {
  const info = await AdsConsent.getConsentInfo().catch(() => null);
  return (
    info?.privacyOptionsRequirementStatus ===
    AdsConsentPrivacyOptionsRequirementStatus.REQUIRED
  );
};

export const showPrivacyOptions = () =>
  AdsConsent.showPrivacyOptionsForm().catch((error) =>
    Sentry.captureException(error)
  );
