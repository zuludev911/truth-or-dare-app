import {
  AdsConsent,
  AdsConsentPrivacyOptionsRequirementStatus,
} from "react-native-google-mobile-ads";
import * as Sentry from "@sentry/react-native";

/**
 * Pide el consentimiento de anuncios (UMP de Google) cuando aplica, por ejemplo
 * en la UE y Reino Unido. Fuera de esas regiones no muestra nada. Los SDK de
 * AdMob y Firebase Analytics leen la respuesta automáticamente.
 *
 * El formulario se configura en AdMob → Privacidad y mensajes.
 */
export const gatherConsent = async (): Promise<boolean> => {
  try {
    const info = await AdsConsent.gatherConsent();
    return info.canRequestAds;
  } catch (error) {
    console.warn("Consent gathering failed:", error);
    Sentry.captureException(error);
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
