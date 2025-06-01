import { Platform, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AD_IDS } from "../services/ads";

const AdBanner = () => {
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.select({
        android: AD_IDS.ANDROID_BANNER,
        ios: AD_IDS.IOS_BANNER,
      });

  const { bottom } = useSafeAreaInsets();
  return (
    <View style={{ position: "absolute", bottom, left: 0, right: 0 }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
};

export default AdBanner;
