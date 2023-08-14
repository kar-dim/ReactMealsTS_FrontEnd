import adminStyle from "./AdminMenu.module.css"
import Header from "./Header";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const AdminMenu = () => {
    
    //TODO, get dishes online first? hmm

    return (
        <>
        <Header />
        <div id={adminStyle.main}>
            <div id={adminStyle.main_content}>
            <Tabs>
                <TabList>
                <Tab>Add Dish</Tab>
                <Tab>Edit Dishes</Tab>
                </TabList>

                <TabPanel>
                <h2>Any content 1</h2>
                </TabPanel>
                <TabPanel>
                <h2>Any content 2</h2>
                </TabPanel>
            </Tabs>
            </div>
        </div>
    </>
    );
}

export default AdminMenu;