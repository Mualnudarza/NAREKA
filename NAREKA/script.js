//
// D:\5 - Project\1 - Project Web\TAKARA Laravel Version\Portofolio\NAREKA\script.js
//

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Fitur 1: Efek Navigasi Aktif saat Scroll ---
    // Logika untuk menyorot link navigasi saat section terkait terlihat
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav ul li a');

    function updateActiveLink() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Jika posisi scroll sudah melewati bagian atas section
            if (pageYOffset >= sectionTop - 150) { 
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').substring(1) === current) {
                a.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Panggil saat memuat untuk menentukan bagian awal
    
    // Tambahkan style untuk link aktif di CSS:
    /*
    header nav ul li a.active {
        color: #ff6600; 
        font-weight: 700; 
    }
    */


    // --- Fitur 2: Filter Proyek ---
    const filterButtons = document.querySelectorAll('.project-filters button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hapus kelas 'active' dari semua tombol
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Tambahkan kelas 'active' ke tombol yang diklik
            this.classList.add('active');
            
            // Di sini Anda bisa menambahkan logika untuk menyaring (filter) proyek 
            // berdasarkan teks tombol (misalnya: 'Web Design', 'App Design', dll.)
            const filterValue = this.textContent;
            console.log(`Filter Proyek: ${filterValue}`);
            // (Contoh: Menampilkan/menyembunyikan kartu proyek di .projects-grid)
        });
    });

    
    // --- Fitur 3: Efek Scroll untuk Header (Opsional) ---
    // Contoh: Ubah warna latar belakang header saat di-scroll
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.backgroundColor = '#fff';
        }
    });
    
});