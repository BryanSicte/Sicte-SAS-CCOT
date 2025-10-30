import { useUserData } from "./UserDataContext";
import { PlantaDataProvider } from "./PlantaDataContext";
import TokenCountdown from "../componentes/TokenCountdown";
import { useTokenUserData } from "./TokenUserContext";
import { useUserMenu } from "./UserMenuContext";
import { MaterialDataProvider } from "./MaterialDataContext";

export const GlobalDataProvider = ({ children }: { children: React.ReactNode }) => {
    const { tokenUser } = useTokenUserData();
    const { user, logout } = useUserData();
    const { setMenuVisibleUser } = useUserMenu();

    return (
        <MaterialDataProvider>
            <PlantaDataProvider>
                {children}
                {user &&
                    <TokenCountdown
                        expiryDate={tokenUser?.expiryDate}
                        floating
                        logout={logout}
                        setMenuVisibleUser={setMenuVisibleUser}
                    />
                }
            </PlantaDataProvider>
        </MaterialDataProvider>
    );
};