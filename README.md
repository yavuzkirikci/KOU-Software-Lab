# KOU-Software-Lab
Kocaeli Üniversitesi Yazılım Laboratuvarı Projeleri(2021-2022)

-CARGO COMPANY PROJECT-
Nodejs programlama dili kullanılarak bir kurye yönetim sistemi yapılmak amaçlanmıştır. Kullanıcı arayüz üzerinde istediği noktalara tıklayarak kuryenin gitmesi gereken yerleri işaretler ve 'Kargoyu Hareket Ettir' butonuna basar.

Uygulama Google Maps API ile bağlantı kurar ve seçilen konumlar arasındaki mesafeleri ve gidilebilecek en kısa yolları çeker.

Daha sonra Djkstra algoritması kullanılarak en kısa yolu bulur ve bu yolu kullanarak kuryeyi hareket ettirir.

-SAMURAI SUDOKU SOLVER-
Java programlama dili kullanılarak samurai sudoku çözümleyici bir program yazılmıştır. Sudoku çözümleme problemi 9x9'luk bir sudoku çözümlemekten farklı olarak 9 adet 9x9'luk sudoku çözümlemekten oluşmaktadır. Bu 9 adet sudoku çözümlemesi için 'Divide and Conquer' yaklaşımı kullanılmıştır. Eğer bir hareket yapıldığında sudoku çözülemezse bu hareket geri alınır ve başka bir hareket denenir. Bu işlem sudoku çözülebilene kadar devam eder.

Program aynı zamanda 'Multithreading' konusunu da kapsamaktadır. Çözümleme işlemi için eğer thread sayısını arttırsak çözümleme süresi azalır mı? sorusuna cevap arar. Sonuç olarak thread sayımız belirli bir düzeye kadar arttırıldıkça çözümleme süresi azalmaktadır.

-PDF UPLOAD PLATDORM-
Proje, kullanıcı ve admin panellirinin bulunduğu bir dosya yükleme sistemi oluşturmayı amaçlamıştır.

Başlangıçta kullanıcıdan email ve şifre bilgilerine göre giriş yapması istenir. Eğer kullanıcı bilgileri veritabanında bulunuyorsa kullanıcı yetkinliğine göre panel sayfasına yönlendirilir.

Admin yetkisine sahip kullanıcılar veritabanındaki kullanıcı giriş bilgilerini güncelleyebilir. Aynı zamanda sisteme yüklenen pdf dosyalarını belirli kriterlere göre sorgulayabilir.

User yetkisine sahip kullanıcılar veritabanında bulunan login id’lerine göre sisteme pdf dosyası yükleyebilirler. Sorgu bölümünde ise sadece kendi yükledikleri dosyalara erişebilirler.

-TAXI LOCATION FINDER-
Bir taksi firmasındaki taksilerdeki GPS verileri kullanılarak seçilen taksinin istenilen zamanda nerede olduğunun görülebildiği proje.

-ACADEMIC SEARCH SITE-
Proje,Neo4j veritabanı kullanarak bir akademik yayın platformu oluşturmayı amaçlamıştır. Neo4j veritanı projeden bağımsız bir sunucuda çalışmaktadır. Proje gerekli authentication bilgilerini kullanarak bu sunucuya bağlanır ve veritabanı üzerinde işlemler yapar.

Server tarafında Nodejs kullanılmıştır. Client tarafında ise React kullanılmıştır. Server, Client'ın istediği Yayın Ekleme, Yayın Silme, Yayın Güncelleme, Yayın Listeleme, Yayın Sorgulama gibi işlemleri gerçekleştirir.

Client ise bu işlemleri gerçekleştirdikten sonra veritabanında yapılan değişiklikleri görebilmek için veritabanından verileri çeker ve ekrana basar.
