import { useUserData } from "./UserDataContext";
import { PlantaDataProvider } from "./PlantaDataContext";
import TokenCountdown from "../componentes/TokenCountdown";
import { useTokenUserData } from "./TokenUserContext";
import { useNavigation } from "@react-navigation/native";
import { useUserMenu } from "./UserMenuContext";

export const GlobalDataProvider = ({ children }: { children: React.ReactNode }) => {
    const { tokenUser } = useTokenUserData();
    const navigation = useNavigation();
    const { user, logout } = useUserData();
    const { setMenuVisibleUser } = useUserMenu();

    return (
        <PlantaDataProvider>
            {children}
            {user &&
                <TokenCountdown
                    expiryDate={tokenUser?.expiryDate}
                    floating
                    navigation={navigation}
                    logout={logout}
                    setMenuVisibleUser={setMenuVisibleUser}
                />
            }
        </PlantaDataProvider>
    );
};