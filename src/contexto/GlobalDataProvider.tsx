import { useUserData } from "./UserDataContext";
import { PlantaDataProvider } from "./PlantaDataContext";
import TokenCountdown from "../componentes/TokenCountdown";
import { useTokenUserData } from "./TokenUserContext";

export const GlobalDataProvider = ({ children }: { children: React.ReactNode }) => {
    const { tokenUser } = useTokenUserData();
    const { user } = useUserData();

    return (
        <PlantaDataProvider>
            {children}
            {user &&
                <TokenCountdown expiryDate={tokenUser?.expiryDate} floating />
            }
        </PlantaDataProvider>
    );
};