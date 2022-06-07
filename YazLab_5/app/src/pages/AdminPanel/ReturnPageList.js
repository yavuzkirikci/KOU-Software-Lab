import CreateIcon from '@mui/icons-material/Create';

function ReturnPageList(){
    return [
        {
            page_name : "Yayın Ekle",
            page_url : "/admin/add_publishment",
            icon : <CreateIcon />
        }
    ]
}

export default ReturnPageList;