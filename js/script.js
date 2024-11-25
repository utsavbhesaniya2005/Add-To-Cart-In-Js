let pId = document.getElementById('proId');
let pname = document.getElementById('proName');  
let desc = document.getElementById('proDesc'); 
let category = document.getElementById('proCategory'); 
let price = document.getElementById('proPrice');
let viewProduct = document.getElementById('viewProduct');
let selectShow = document.getElementById('cart');

const Storageget = (getData) => JSON.parse(localStorage.getItem(getData)) || [];
let storage = Storageget('users');
let cart = Storageget('cart');
// let isValid = false;// let isIndex = null;

const submitData = () => {
    event.preventDefault();

    const pIdget = pId.value || Math.floor(Math.random() * 1000);

    const dataObj = {Id : pIdget, Name : pname.value, Desc : desc.value, Desc : desc.value, Category : category.value, Price : price.value}

    if(dataObj.Name.trim() == '' && dataObj.Desc.trim() == '' && dataObj.Category.trim() == '' && dataObj.Price.trim() == ''){

        document.getElementById('errName').innerHTML = "All Field Must Be Required.";
        document.getElementById('errDesc').innerHTML = "All Field Must Be Required.";
        document.getElementById('errCate').innerHTML = "All Field Must Be Required.";
        document.getElementById('errPrice').innerHTML = "All Field Must Be Required.";

    }else{
        
        document.getElementById('errName').innerHTML = "";
        document.getElementById('errDesc').innerHTML = "";
        document.getElementById('errCate').innerHTML = "";
        document.getElementById('errPrice').innerHTML = "";

        storage = pId.value ? storage.map((data) => data.Id == pIdget ? dataObj : data) : [...storage,dataObj];

        localStorage.setItem("users",JSON.stringify(storage));

        viewData();
    
        pname.value = desc.value = category.value = price.value = '';
    }
}

const handleEdit = (id) => {
    let EditData = storage.find((data) => data.Id == id)

    if(EditData){
        ({Id : pId.value, Name : pname.value, Desc : desc.value, Category : category.value, Price : price.value} = EditData)
    }else{
        alert("data not edit");
    }
    viewData();
}
const handleDelete = (id) => (localStorage.setItem("users",JSON.stringify(storage = storage.filter((item) => item.Id != id))),viewData())   

const viewData = () => {
    viewProduct.innerHTML = storage.map((data) =>
        `<div class="col-4">
            <div class="card">
                <div class="image">
                    <img src="../images/item-image.jpg">
                </div>
                <div class="content">
                    <h3 class="my-3">${data.Name}</h3>
                    <p>${data.Desc}</p>
                    <h5>${data.Category}</h5>
                    <h6 class="my-3">Price : ${data.Price}</h6>
                    <ul class="d-flex ps-0">
                        <li>
                            <button class='btn text-bg-primary' onclick='handleSelect(${data.Id})'}>Select</button>
                        </li>
                        <li>
                            <button class='btn text-bg-success' onclick='handleEdit(${data.Id})'}>Update</button>
                        </li>
                        <li>
                            <button class='btn text-bg-danger' onclick='handleDelete(${data.Id})'}>Delete</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>`
    ).join('');
}

const countData = () => (document.getElementById('countData').innerHTML = cart.length);
const tPrice = () => (cart.reduce((total, item) => total + (item.Price || 0) * (item.quan || 1), 0));

const handleSelect = (id) => {
    let selectRec = storage.find((selectData) => selectData.Id == id);
    if(selectRec && !cart.some((item) => item.Id == id)){
        cart.push(selectRec);
        localStorage.setItem('cart', JSON.stringify(cart));
    }else{
        alert("Data Cannot Be Same..");
    }
    viewCart(),countData();
}

const quantity = (id, valueChange) => {
    cart = cart.map((data) => {
        if(data.Id == id){
            return { ...data, quan: Math.max((data.quan || 1) + valueChange, 1) };
        }else{
            return data;
        }
    });
    localStorage.setItem('cart', JSON.stringify(cart)),viewCart();
}

const removeFromCart = (id) => ( localStorage.setItem("cart",JSON.stringify(cart = cart.filter((item) => item.Id != id))),viewCart(),countData())

const viewCart = () => {
    selectShow.innerHTML = cart.map((data) => 
        `<tr>
            <td><img src="../images/item-image.jpg"></td>
            <td>${data.Name}</td>
            <td>${data.Desc}</td>
            <td>${data.Category}</td>
            <td>${data.Price}</td>
            <td><a href="#" class="btn btn-success me-2" onclick="return quantity(${data.Id}, 1)">+</a>${data.quan || 1}<a href="#" class="btn btn-danger ms-2" onclick="return quantity(${data.Id},-1)">-</a></td>
            <td><button class='btn text-bg-danger' onclick='removeFromCart(${data.Id})'>Remove</button></td>
        </tr>`
        ).join('');
        const totalprice = tPrice();
        document.getElementById("total-price").innerHTML = `Total Price :- ₹ ${totalprice.toFixed(2)}`;
}
viewData(),viewCart(),countData();