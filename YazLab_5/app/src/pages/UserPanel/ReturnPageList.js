import SearchIcon from '@mui/icons-material/Search';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

function ReturnPageList(){
    return [
        {
            page_name : "Arama Sayfası",
            page_url : "/user/search",
            icon : <SearchIcon />
        },
        {
            page_name : "Grafik Sayfası",
            page_url : "/user/graph",
            icon : <AutoGraphIcon />
        }
    ]
}

export default ReturnPageList;