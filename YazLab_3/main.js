var express = require('express');  
var app = express();    
const fileUpload = require("express-fileupload")
const methodOverride = require('method-override')
const fs = require("fs")
const mongoose = require('mongoose');
let PDFParser = require("pdf2json");
let XMLHttpRequest = require('xhr2');
const pdfjsLib = require("pdfjs-dist")
const path = require("path")
// giriş yapan kullanıcın database deki ID si
let LOGIN_ID = ""

// ejs settings
const ejs = require("ejs")
app.set("view engine", "ejs")

// database connection
let MongoClient = require('mongodb').MongoClient;
const { restart } = require('nodemon');
const ObjectIdd =  require("mongodb").ObjectId
let url = "mongodb+srv://admin:admin@cluster0.suejd.mongodb.net/proje3?retryWrites=true&w=majority"
let url2 = "mongodb://localhost:27017/proje3?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
const {db_user, db_pdf_file} = require("./schemas")

const req = require('express/lib/request');

app.use(express.static("public"))
app.use("/docs", express.static(path.join(__dirname, "docs")))
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(fileUpload())
app.use(methodOverride('_method', {
  methods: ["POST", "GET"]
}))

// Giriş Sayfası
app.get('/', async function (req, res) {  
    // Database ilk bağlantı yapılmasını bekle
    await mongoose.connect(url);
    
    res.render("index", {
      alert_flag : false
    });  
});

// Giriş bilgilerinin database de olup olmadığını kontrol et ve giriş
// yapan kullanıcınıyı yetkisine göre yönlendir.
app.post('/loginCheck', async (req, res) => {
  let a  = await db_user.find({"email" : req.body.email , "password" : req.body.password})
  console.log(a)
  if(a.length > 0){
    LOGIN_ID = a[0]._id
    if(a[0].type == "admin"){
      res.render("admin_pannel")
    }
    else
      res.render("user_panel") 
  }
  else{
    res.render("index", {
      alert_flag : true
    })
  }
  
})

// Admin panelinde kullanıcı ekle
app.post("/add_user_post", async (req, res) => {
  await db_user.create({
    email : req.body.email,
    password: req.body.password,
    type : req.body.user_type
  })
  res.render("admin_pannel")
})

// Admin panelinde kullanıcı sil
app.get("/delete_user", async (req,res) => {
  res.render("delete_user", {
    alert_flag : false
  })
})


// Admin panelinde kullanıcı güncelle
app.get("/edit_user", async (req,res) => {
  res.render("edit_user", {
    alert_flag : false
  })
})


// Güncellemek istenen kullanıcı bilgilerinin veritabanında olup olmadığını kontrol et
app.post("/edit_user_post", async (req, res) => {
  let a  = await db_user.find({"email" : req.body.email})
  if(a.length == 0){
    res.render("edit_user", {
      alert_flag : true
    })
  }
  else{
    await db_user.findOneAndDelete({email : req.body.email})
    res.render("edit_user_2", {
      body : a[0]
    })
  }
})

// Yeni girilen bilgilere göre kullanıcıyı güncelle.
app.post("/edit_user_post_2" , async (req, res) => {
  db_user.create({
    email : req.body.email,
    password: req.body.password,
    type : req.body.user_type
  })
  res.render("admin_pannel")
})

// Silinmek istenen kullanıcının veritabanında olup olmadığını kontrol et
app.post("/delete_user_post", async (req, res) => {
  let a  = await db_user.find({"email" : req.body.email})
  if(a.length == 0){
    res.render("delete_user", {
      alert_flag : true
    })
  }
  else{
    await db_user.findOneAndDelete({email : req.body.email})
    res.render("admin_pannel")
  }
})

// Kullanıcı Ekle
app.get("/add_user", (req, res) => {
  res.render("add_user")
})

app.get("/file_upload", (req,res) => {
  res.render("file_upload")
})

// Pdf ten çıkarılan bilgileri veritabanına kaydet
app.post("/file_upload_post_2", async(req,res) => {
  
  await db_pdf_file.create({
    user_id : LOGIN_ID,
    path : controlCharacters(req.body.path).trim(),
    student_name : controlCharacters(req.body.student_name).trim().toUpperCase(),
    student_number : controlCharacters(req.body.student_number).trim().toUpperCase(),
    ogretim_turu : controlCharacters(req.body.ogretim_turu).trim().toUpperCase(),
    term : controlCharacters(req.body.term).trim().toUpperCase(),
    lesson : controlCharacters(req.body.lesson).trim().toUpperCase(),
    abstract : controlCharacters(req.body.abstract).trim().toUpperCase(),
    date : controlCharacters(req.body.date).trim().toUpperCase(),
    keywords : controlCharacters(req.body.keywords).trim().toUpperCase(),
    advisor : controlCharacters(req.body.advisor).trim().toUpperCase(),
    jury1 : controlCharacters(req.body.jury1).trim().toUpperCase(),
    jury2 : controlCharacters(req.body.jury2).trim().toUpperCase(),
    department : controlCharacters(req.body.department).trim().toUpperCase(),
    project_name : controlCharacters(req.body.project_name).trim().toUpperCase()
  })
  res.render("user_panel")
})

// Verilen pdf teki bilgileri çıkar ve onaylama sayfasına yönlendir.
app.post("/file_upload_post", async (req,res) => {
  let pdf = req.files.pdf
  let dir = "docs/" + pdf.name

  // pdf i public/pdf_files içine kaydet
  pdf.mv(dir, function(err){
    
    
    let filename = dir.split("").splice(0, dir.length - 4).join("")
    console.log("filename : " + filename)
    let infos = {}
    const pdfParser = new PDFParser(this, 1);
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
        fs.writeFile(filename + ".txt", pdfParser.getRawTextContent(), () => { console.log("Done."); });
    });
    
    pdfParser.loadPDF(filename + ".pdf");

    // Belirli bir sayfa aralığını string olarak döndür.
    function readPage(arrayOfLines, pageNum1, pageNum2) {
        let find = "----------------Page (" + String(pageNum1) + ") Break----------------"
        let find2 = "----------------Page (" + String(pageNum2) + ") Break----------------"
        let pageText = []
        let flag = false
        for (let i = 0; i < arrayOfLines.length; i++) {
            if (arrayOfLines[i].split("").splice(0, find.length).join("") == find) {
                flag = true
                continue
            }
            else if (arrayOfLines[i].split("").splice(0, find.length).join("") == find2) {
                break
            }
            if (flag == true) {
                pageText.push(arrayOfLines[i])
            }
        }
        return pageText
    }

    // String içerisinde belirli bir kalıbı ara
    function searchPattern(line, pattern) {
        if (line.split("").splice(0, pattern.length).join("") == pattern) {
            return [true, line.split("").splice(pattern.length).join("")]
        }
        return [false, false]
    }

    setTimeout(() => {
        let textData

        const promise = new Promise((resolve, reject) => {
            fs.readFile(filename + ".txt", 'utf8', function (err, data) {
                if (err) throw err;
                textData = data
                resolve("cozuldu")
            });
        });

        promise.then(message => {
            let arrayOfLines = textData.split("\n");
            // Satırlardaki gereksiz boşlukları sil.
            for (let i = 0; i < arrayOfLines.length; i++) {
                arrayOfLines[i] = arrayOfLines[i].slice(0, -1)
            }

            // 4.sayfadan isim ve öğrenci no bilgileri çıkarıldı
            let text = readPage(arrayOfLines, 2, 3)
            let ogrenciNo = ""
            let isim = ""
            let ogretimTuru = ""

            for (let i = 0; i < text.length; i++) {
                let o = searchPattern(text[i], "Öğrenci No:")
                let is = searchPattern(text[i], "Adı Soyadı:")
                let og = searchPattern(text[i], "Öğretim Türü:")
                if (o[0] == true) {
                    ogrenciNo = o[1]
                }
                if (is[0] == true) {
                    isim = is[1]
                }
                if (og[0] == true) {
                    ogretimTuru = og[1]
                }
            }
            infos["student_number"] = ogrenciNo
            infos["student_name"] = isim
            infos["term"] = ogretimTuru
            infos["ogretim_turu"] = infos["student_number"].split("").splice(6, 1).join("") + ".Öğretim"

            // 2.sayfadan bölüm, tez ismi, danışman ismi,
            // Jüri isimleri ve tarih bilgileri çıkarıldı
            text = readPage(arrayOfLines, 0, 1)
            console.log(text)
            let bolum = ""
            let tez_ismi = ""
            let danisman_isim = ""
            let juri1 = ""
            let juri2 = ""
            let tarih = ""
            let ek = 0
            bolum = text[3]
            let lesson = text[6]
            tez_ismi = text[8]
            if (text[9][0] != ' ') {
                tez_ismi += text[9]
                ek = 1
            }
            for (let i = 10; i < text.length; i++) {
              let o = searchPattern(text[i], "Danışman")
              if (o[0] == true) {
                danisman_isim = text[i-1]
                juri1 = text[i+1]
                juri2 = text[i+3]
                tarih = text[i+6].split("").splice(24).join("")
                break
              }
            }
            infos["department"] = bolum
            infos["project_name"] = tez_ismi
            infos["advisor"] = danisman_isim
            infos["jury1"] = juri1
            infos["jury2"] = juri2
            infos["date"] = tarih.split("").splice(0, 11).join("")
            infos["term"] = tarih.split("").splice(14).join("")
            infos["lesson"] = lesson

            // 10.sayfadan özet bilgileri ve anahtar kelimeler çıkarıldı.
            text = readPage(arrayOfLines, 8, 9)
            console.log(text)
            let abstract = []
            let keywords = ""
            for (let i = 7; i < 27; i++) {
                if (text[i].trim().length == 0)
                    break
                abstract.push(text[i].trim())
            }

            for (let i = 10; i < text.length; i++) {
              let o = searchPattern(text[i], "Anahtar  Kelimeler:")
              if (o[0] == true) {
                keywords = text[i].split("").splice(19).join("")
                if (text[i+1][0] != " ")
                    keywords += text[i+1]
                break
              }
            }

            infos["abstract"] = abstract
            infos["keywords"] = keywords
            infos["path"] = dir
            res.render("file_upload_approval", {
              infos : infos,
              abs : infos.abstract
            })
            
        })
    }, 1000);
  })

})

async function checkUserType(){
  let a = await db_user.findOne({_id : LOGIN_ID})
  return a.type
}

// pdf arama ekranı
app.get("/search_pdf_admin", async (req,res) => {
  res.render("search_pdf_admin", {
    results : {},
    type : "admin"
  })
  
})

app.get("/search_pdf_user", async (req,res) => {
  res.render("search_pdf_user", {
    results : {},
    type : "user"
  })
  
})

// verilen body nesnesinin bos olup olmadığını kontrol et ve filtreye ekle
function controlBody(body, key,filter){
  if(body != ""){
    filter[key] = body
  }
  return filter
}

function controlCharacters(str){
  let a = str.split("")
  for(let i=0; i<a.length; i++){
    if(a[i] == "i")
      a[i] = "İ"
  }
  return a.join("")
}

function checkKeyword(given, control){
  for(let i=0; i<given.length; i++){
    for(let j=0; j<control.length; j++){
      if(given[i] == control[j])
        return true
    }
  }
  return false
}

app.post("/search_pdf_post", async (req,res) => {
  filter = {}

  if(req.body.type  == "admin")
    filter = controlBody(controlCharacters(req.body.author).trim().toUpperCase(), "student_name", filter)
  filter = controlBody(controlCharacters(req.body.lesson).trim().toUpperCase(), "lesson", filter)
  filter = controlBody(controlCharacters(req.body.project_name).trim().toUpperCase(), "project_name", filter)
  filter = controlBody(controlCharacters(req.body.term).trim().toUpperCase(), "term", filter)
  
  if(req.body.type == "admin"){
    // Kullanıcı kontrol işlemleri
    if(req.body.user_email != ""){
      let a = await db_user.findOne({email : req.body.user_email})
      console.log(a)
      if(a){
        filter["user_id"] = String(a._id)
      }
      else{
        filter["user_id"] = "-1"
      }
    }
  }
  else{
    filter["user_id"] = LOGIN_ID
  }
  

  let results = await db_pdf_file.find(filter)
  
  // Anahtar kelime kontrol işlemleri
  if(req.body.keywords != ""){
    
    let given_keywords = controlCharacters(req.body.keywords).trim().toUpperCase().split(",")
    for(let i=0; i<results.length; i++){
      let control_keywords = results[i].keywords.split(",")
      for(let j=0; j<control_keywords.length; j++){
        control_keywords[j] = control_keywords[j].trim()
      }
      console.log(given_keywords)
      console.log(control_keywords)
      if(checkKeyword(given_keywords, control_keywords)){
  
      }else{
        results.splice(i, 1)
        i -= 1
      }
    }
  }

  if(req.body.type == "user"){
    res.render("search_pdf_user", {
      results : results,
      type : req.body.type
    })
  }
  else{
    res.render("search_pdf_admin", {
      results: results,
      type : req.body.type
    })
  }

  
})

app.get("/show_pdf_infos/:id", async (req,res) => {
  let a = await db_pdf_file.findOne({_id : req.params.id})
  let user = await db_user.findOne({_id : LOGIN_ID})

  res.render("show_pdf_infos", {
    infos : a,
    user_type : user.type,
    path : a.path
  })
})



var server = app.listen(3000, function () {  
  var host = server.address().address;  
  var port = server.address().port;  
  console.log('Example app listening at http://%s:%s', host, port);  
});  