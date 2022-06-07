import React from 'react';
import ReturnPageList from './ReturnPageList';
import AppBarWithDrawer from '../../components/AppBarWithDrawer';
import {TextField, Typography, Paper, Button} from '@mui/material';
import axios from 'axios';

function AddPublishmentPage() {
    const page_list = ReturnPageList()
    const [publishmentInfo, setPublishmentInfo] = React.useState({
        "author_id" : "", "author_name" : "", "author_surname" : "", "name" : "",
        "year" : "", "publisher" : "", "type" : ""
    })

    function isNumeric(value) {
        return /^-?\d+$/.test(value);
    }

    const handleChange = (e, key) => {
        let newPublishmentInfo = JSON.parse(JSON.stringify(publishmentInfo))
        newPublishmentInfo[key] = e.target.value
        setPublishmentInfo(newPublishmentInfo)
    }

    const handleAddPublishment = (e) => {
        e.preventDefault()

        if(publishmentInfo.author_id === ""){
            if(publishmentInfo.author_name === "" || publishmentInfo.author_surname === ""){
                alert("Yazar ad-soyad veya ID alanlarından birinin girilmesi gerekmektedir")
                return
            }
        }


        if(publishmentInfo.name === "" || publishmentInfo.year === "" || publishmentInfo.publisher === "" || publishmentInfo.type === ""){
            alert("Lütfen gerekli alanları doldurunuz.")
            return
        }
            
        

        // write post request
        axios.post('/add_publication', publishmentInfo)
        .then(res => {
            console.log(res)
            alert("Yayınınız başarıyla eklendi.")
        }
        )
        .catch(err => {
            console.log(err)
            alert("Bir hata oluştu. Lütfen tekrar deneyiniz.")
        }
        )

    }

    return(
        <AppBarWithDrawer content={
            <div>
                <Paper sx={{marginRight : 20}}>
                    <Typography sx={{fontSize:20}}>Eklemek İstediğiniz Yayının Bilgilerini Giriniz</Typography>
                    
                    <TextField id="outlined-basic" variant="outlined" label = "Araştırmacı ID" margin="normal" fullWidth 
                    value={publishmentInfo.author_id} onChange={(e) => {handleChange(e,"author_id")}}></TextField>
                    
                    <TextField label = "Araştırmacı Adı" margin="normal" fullWidth
                    value={publishmentInfo.author_name} onChange={(e) => {handleChange(e,"author_name")}}></TextField>
                    
                    <TextField label = "Araştırmacı Soyadı" margin="normal" fullWidth
                    value={publishmentInfo.author_surname} onChange={(e) => {handleChange(e,"author_surname")}}></TextField>
                    
                    <TextField label = "Yayın Adı" margin="normal" fullWidth
                    value={publishmentInfo.name} onChange={(e) => {handleChange(e,"name")}}></TextField>
                    
                    <TextField label = "Yayın Yılı" margin="normal" fullWidth
                    value={publishmentInfo.year} onChange={(e) => {handleChange(e,"year")}}></TextField>
                    
                    <TextField label = "Yayın Yeri" margin="normal" fullWidth
                    value={publishmentInfo.publisher} onChange={(e) => {handleChange(e,"publisher")}}></TextField>
                    
                    <TextField label = "Yayın Türü" margin="normal" fullWidth
                    value={publishmentInfo.type} onChange={(e) => {handleChange(e,"type")}}></TextField>
                    
                    <Button sx={{float : "right", marginTop : 3}} variant="outlined" onClick={handleAddPublishment}>Yayını Ekle</Button>
                </Paper>
                
                
            </div>
        } 
        appBarHeader = "Admin Panel"
        pageList= {page_list}
        />
    )
}

export default AddPublishmentPage