var module = {
    // config with empty cache and selected attributes
    config:{
        cache: {},
        selected: null
    },
    getListItems: function(){
        // fetches from api using get
        // converts response to json
        // takes json response and generates elements on the page
        // on error displays sold out message
        return (
            fetch(`https://nursery.misfitsmarket.com/api/test/v1`, {
                method: 'GET'
            })
            .then((response) => response.json())
            .then((data) => { 
                console.log(data.data.items)
                this.config.cache = data.data.items
                data.data.items.map((item)=>{
                    let product = document.createElement('div')
                        product.classList.add('product')
                        product.classList.add(item.product)
                        product.setAttribute('id', item.id)
                        product.setAttribute('product', item.product)
                        product.setAttribute('price', item.price)
                    let productText = document.createElement('h2')
                        productText.textContent= item.product
                    let propductPrice = document.createElement('h3')
                        propductPrice.textContent = '$'+item.price
                    product.append(productText)
                    product.append(propductPrice)
                    let app = document.getElementById('app')
                    app.append(product)
                })
            })
            .catch((error) => {
                console.log(error.message)
                errorMessage = document.createElement('h3')
                errorMessage.classList.add('text-center')
                errorMessage.textContent = 'Sorry, Sold Out!'
                let app = document.getElementById('app')
                app.append(errorMessage)
            })
        )
    },
    addToCart: function(itemValue){
        // post to api with selected items ID
        // response to json, then displays message
        // on success hides add to cart button
        return (
            fetch(`https://nursery.misfitsmarket.com/api/test/v1/${itemValue}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Customer-Token': 721028102,
                }
            })
            .then((response) => response.json())
            .then((data) => {
                const atcButton = document.getElementById('addToCart')
                if( atcButton ){
                    atcButton.style.visibility = 'hidden'
                }
                return data.msg
            })
            .catch((error)=>console.log(error.message))
        )
    }
};

// generate list items, then add click listeners
window.onload= function(){
    module.getListItems()
    .then(()=>{
        let products = document.querySelectorAll('.product');
        for(i=0; i<products.length;i++){
            console.log(products[i])
            products[i].addEventListener('click', function(){
                const button = document.getElementById('addToCart');
                // if contains selected already, remove selected
                // else remove other selected and add selected to clicked element
                if(this.classList.contains('selected')){
                    console.log('remove')
                    this.classList.remove('selected');
                    module.config.selected = null;
                    console.log('clicked id: ' + this.getAttribute('id'))
                    button.style.visibility = 'hidden'
                }else{
                    const active = document.querySelector('.selected');
                    if (active) {
                        active.classList.remove('selected');
                        module.config.selected = null
                    }
                    this.classList.add('selected');
                    module.config.selected = this.getAttribute('id');
                    console.log('clicked id: '+ module.config.selected)
                    button.style.visibility = 'visible'
                }
            })
        }
    })
    
    // add to cart click handler and call to addToCart
    const atcButton = document.getElementById('addToCart');
    atcButton.addEventListener('click', (event)=>{
        event.preventDefault();
        console.log('atc clicked')
        module.addToCart(module.config.selected)    
    })
}
        