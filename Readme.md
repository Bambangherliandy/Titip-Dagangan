1️⃣ AuthController.js

register(req, res) → daftar user baru, simpan di tabel Users, hash password, return JWT token.

login(req, res) → cek email & password, generate JWT token, return token + info user.

2️⃣ UserController.js

profile(req, res) → tampilkan data user login (Users) dari req.user.

update(req, res) → update profile user (nama, email, password jika ingin ubah).

3️⃣ SellerController.js

register(req, res) → daftar user jadi seller, simpan di Sellers (link ke user_id).

profile(req, res) → tampilkan profile seller login.

update(req, res) → update data seller (nama toko, alamat, nomor HP, dsb).

4️⃣ ProductController.js

list(req, res) → tampilkan semua produk, bisa filter by category / search / pagination.

detail(req, res) → tampilkan detail produk berdasarkan product_id.

create(req, res) → seller tambah produk baru (name, category_id, price, stock, dsb).

update(req, res) → seller update produk tertentu.

delete(req, res) → seller hapus produk tertentu.

5️⃣ CategoryController.js

list(req, res) → tampilkan semua kategori produk.

(Opsional admin) create(req, res) → tambah kategori baru.

(Opsional admin) update(req, res) → update kategori.

(Opsional admin) delete(req, res) → hapus kategori.

6️⃣ CartController.js

viewCart(req, res) → tampilkan semua item di cart user login.

addToCart(req, res) → tambah produk ke cart user (cart_id + product_id + quantity).

removeItem(req, res) → hapus item dari cart berdasarkan cart_item_id.

clearCart(req, res) → kosongkan semua item di cart user.

7️⃣ OrderController.js

checkout(req, res) → ambil semua cart user → buat order & order_item → kosongkan cart.

list(req, res) → tampilkan semua order user login.

detail(req, res) → tampilkan detail order tertentu.

(Opsional Seller) listSellerOrders(req, res) → seller lihat semua order untuk produk mereka.

(Opsional Seller) updateOrderStatus(req, res) → seller ubah status order (pending → shipped → delivered).

8️⃣ ReviewController.js

create(req, res) → user kasih review produk tertentu (rating, komentar).

listByProduct(req, res) → tampilkan semua review untuk produk tertentu.

9️⃣ WithdrawlController.js

create(req, res) → seller tarik saldo mereka dari total earning → simpan di Withdrawl.

history(req, res) → tampilkan semua history withdraw seller login.

💡 Tips Agar Cepat Kerja:

Bikin satu controller dulu → test CRUD → lanjut ke controller berikutnya.

Gunakan req.user dari authentication middleware untuk user_id / seller_id.

Selalu wrap logic dengan try { } catch (err) { next(err); }.

Mulai dari MVP dulu (Auth, Product, Cart, Order) → baru Review & Withdraw.
