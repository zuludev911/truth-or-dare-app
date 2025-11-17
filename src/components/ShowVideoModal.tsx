import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconPlayerPlayFilled } from "@tabler/icons-react-native";

import { COLORS } from "../constants";
import extremo from "../assets/extremo.webp";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/Navigation";
import { saveUnlockTime } from "../utils";
import CloseButton from "./CloseButton";
import { AD_IDS } from "../services/ads";

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: (isVisible: boolean) => void;
}

const adUnitId = __DEV__ ? TestIds.REWARDED : AD_IDS.REWARD_ID;
const rewarded = RewardedAd.createForAdRequest(adUnitId);

function ShowVideoModal({ isModalVisible, setIsModalVisible }: Props) {
  const [loaded, setLoaded] = useState(false);
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Categories">>();
  const onPressClose = () => setIsModalVisible(false);

  const onPressAccept = useCallback(() => {
    setIsModalVisible(false);
    rewarded.show();
  }, []);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => setLoaded(true)
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward of ", reward);
        reward && navigation.navigate("Game", { category: "extremo" });
        saveUnlockTime();
      }
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  return (
    <Modal visible={isModalVisible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <CloseButton onPress={onPressClose} style={styles.closeIcon} />
          <Image source={extremo} style={styles.modalImage} />
          <Text style={styles.modalText}>
            Esta categoría es para adultos y contiene contenido sensible. Para
            acceder a esta categoría debes ver un video de publicidad el cual te
            dará acceso por 2 horas.
          </Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={onPressAccept}
            disabled={!loaded}
          >
            <Text style={styles.modalButtonText}>Ver video</Text>
            <IconPlayerPlayFilled color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalText: { color: COLORS.WHITE, fontSize: 20, fontWeight: "bold" },
  modalContent: {
    backgroundColor: COLORS.PRIMARY,
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 30,
    elevation: 10,
  },
  modalButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  modalButtonText: {
    color: COLORS.WHITE,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalImage: {
    height: 80,
    width: 200,
    alignSelf: "center",
  },
  closeIcon: {
    width: 30,
    height: 30,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
});

export default ShowVideoModal;
