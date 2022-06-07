import React, { useEffect, useState } from 'react';
import AppBarWithDrawer from '../../components/AppBarWithDrawer';
import ReturnPageList from './ReturnPageList';
import {Typography, Paper, TextField, Button, List, ListItem} from '@mui/material';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function SearchPage(){
    const page_list = ReturnPageList()
    const [searchInfo, setSearchInfo] = useState({
        "writerName" : "",
        "publishmentName" : "",
        "publishmentYear" : "",
    })
    const [publications, setPublications] = useState([])
    const navigate = useNavigate();

    const handleChange = (e, key) => {
        let newSearchInfo = JSON.parse(JSON.stringify(searchInfo))
        newSearchInfo[key] = e.target.value
        setSearchInfo(newSearchInfo)
    }

    useEffect(() => {
        async function async_func(){
            console.log("searchInfo", searchInfo)
            let res = await axios.get("/search", {params : searchInfo})
            console.log("res", res.data)
            setPublications(res.data)
        }

        async_func()
    }, [searchInfo])
    
    const generateListItem = (item, id) => {
        return (
            <ListItem key={id}>
                <Paper key={id} margin={4}>
                <Typography variant="h6">{"Başlık : "+ item.title}</Typography>
                <Typography variant="body1">{"Yıl : " +item.year}</Typography>
                <Typography variant="body1">{"Yayın ID : "+ item.publication_id}</Typography>
                <Typography variant="body1">{"Tarih : " + item.date}</Typography>
                </Paper>
            </ListItem>
        )
    }

    const handleAuthorGraph = async () => {
        axios.get("/get_author", {params : {name : searchInfo.writerName}})
        .then(res => {
            if(res.data && res.data.identity){
                navigate('/user/graph/' + res.data.identity);
            }
            else{
                alert("Bu isimde bir yazar bulunamadı.")
            }
        })
    }

    return(
        <AppBarWithDrawer content={
            <div>
                <Paper sx={{marginRight : 20}}>
                    <Typography sx={{fontSize:20}}>Arama Ekranı</Typography>
                    
                    <TextField id="outlined-basic" variant="outlined" label = "Araştırmacı İsmi" margin="normal" fullWidth 
                    value={searchInfo["writerName"]} onChange={(e) => {handleChange(e, "writerName")}}></TextField>
                    <Button onClick={(e) => {handleAuthorGraph()}}>Yazarın Grafiğini Görüntüle</Button>
                    
                    <TextField label = "Yayın Adı" margin="normal" fullWidth
                    value={searchInfo.publishmentName} onChange={(e) => {handleChange(e, "publishmentName")}} ></TextField>
                    
                    <TextField label = "Yayın Yılı" margin="normal" fullWidth
                    value={searchInfo.publishmentYear} onChange={(e) => {handleChange(e, "publishmentYear")}} ></TextField>
                </Paper>
                <h4>Results</h4>
                <List>
                    {publications.map((publication, index) => generateListItem(publication.properties, index))}
                </List>  
            </div>
        } 
        appBarHeader = "User Panel"
        pageList= {page_list}
        />
    )
}



export default SearchPage