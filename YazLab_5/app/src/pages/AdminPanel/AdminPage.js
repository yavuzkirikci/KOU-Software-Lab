import React from 'react';
import AppBarWithDrawer from '../../components/AppBarWithDrawer';
import ReturnPageList from './ReturnPageList';

function AdminPage(){
    const page_list = ReturnPageList()

    return(
        <AppBarWithDrawer content={
            <div>
                <h1>Yönetici Ana Sayfa</h1>
            </div>
        } 
        appBarHeader = "Admin Panel"
        pageList= {page_list}
        />
    )
}

export default AdminPage;