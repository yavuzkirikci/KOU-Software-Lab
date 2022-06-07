import React from 'react';
import AppBarWithDrawer from '../../components/AppBarWithDrawer';
import ReturnPageList from './ReturnPageList';

function UserPage(){
    const page_list = ReturnPageList()

    return(
        <AppBarWithDrawer content={
            <div>
                <h1>Kullanıcı Ana Sayfa</h1>
            </div>
        } 
        appBarHeader = "User Panel"
        pageList= {page_list}
        />
    )
}

export default UserPage;