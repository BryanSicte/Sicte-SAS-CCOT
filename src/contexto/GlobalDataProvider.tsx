import { UserDataProvider } from "./UserDataContext";
import { PageUserProvider } from "./PageUserDataContext";
import { PlantaDataProvider } from "./PlantaDataContext";

export const GlobalDataProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <PageUserProvider>
            <UserDataProvider>
                <PlantaDataProvider>
                    {children}
                </PlantaDataProvider>
            </UserDataProvider>
        </PageUserProvider>
    );
};