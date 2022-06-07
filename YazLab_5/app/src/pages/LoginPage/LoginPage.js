import React,{useState} from 'react';
import styles from './LoginPageStyles.js';
import { Paper, Grid, Avatar, TextField, Button, Typography, ButtonGroup } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [kullaniciGiris, setKullaniciGiris] = useState(true);
    const navigate = useNavigate();

    const handleLogIn = (e) => {
        if(!kullaniciGiris && username === process.env.REACT_APP_ADMIN_USERNAME 
            && password === process.env.REACT_APP_ADMIN_PASSWORD){
                navigate('/admin');
        }
        else if(kullaniciGiris && username === process.env.REACT_APP_NON_ADMIN_USERNAME
            && password === process.env.REACT_APP_NON_ADMIN_PASSWORD){
                navigate('/user');
        }
    }

    return (
        <div style={styles.container}>
            <Typography mt={2} variant="h4">KOCAELİ ÜNİVERSİTESİ VERİTABANI SİSTEMİ</Typography>
            <Paper sx={styles.paper}>
                <ButtonGroup variant = "text" sx = {styles.button_group}>
                    <Button onClick={(e) => {setKullaniciGiris(true)} }>Kullanıcı</Button>
                    <Button onClick={(e) => {setKullaniciGiris(false)}}>Admin</Button>
                </ButtonGroup>
                <Grid align="center">
                    <Avatar sx={styles.avatar}>
                        {
                            kullaniciGiris ? <AccountCircleIcon  sx={styles.icon}/> : <ManageAccountsIcon sx={styles.icon}/>
                        }
                    </Avatar>
                    <TextField label="Username" id="outlined-name" margin="normal" fullWidth 
                    value={username} onChange={(e) => {setUsername(e.target.value)}}/>
                    <TextField label="Password" id="outlined-name" margin="normal" fullWidth type="password"
                    value={password} onChange={(e) => {setPassword(e.target.value)}} />

                    <Button variant="contained" color="primary" sx={styles.button} onClick={handleLogIn}>LOG IN</Button>
                </Grid>
            </Paper>
        </div>
    );
} 

export default LoginPage