import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { RewardedAd } from "react-native-google-mobile-ads";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { IconPlayerPlayFilled } from "@tabler/icons-react-native";

import { COLORS } from "../constants";
import extremo from "../assets/extremo.webp";
import { RootStackParamList } from "../navigation/Navigation";
import CloseButton from "./CloseButton";

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: (isVisible: boolean) => void;
  loaded: boolean;
  rewarded: RewardedAd;
}

function ShowVideoModal({
  isModalVisible,
  setIsModalVisible,
  loaded,
  rewarded,
}: Props) {
  console.log("loaded", loaded);
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Categories">>();
  const onPressClose = () => setIsModalVisible(false);

  const onPressAccept = () => {
    setIsModalVisible(false);
    if (loaded) {
      rewarded.show();
    } else {
      Toast.show({
        type: "info",
        text1: "No se cargaron anuncios, intenta mas tarde",
      });
      rewarded.load();
    }
  };

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
          <TouchableOpacity style={styles.modalButton} onPress={onPressAccept}>
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
