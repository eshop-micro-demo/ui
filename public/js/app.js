const STORE_BASE_URL="http://localhost:8081"
const CHECKOUT_BASE_URL="http://localhost:9090"
let cart = []; // default empty cart

const product_row_tmpl = _.template(`
<tr>
  <td><%= id%></td>
  <td><img class="product_image" src="assets/<%= imgUrl%>"/></td>
  <td><%= name%></td>
  <td class="product_price"><%= price%></td>
  <td><%= stockCount%></td>
  <td><input type="number" placeholder="Quantity" class="qty" value="1"/><input type="hidden" class="productId" value="<%= id%>"/><button type="submit" class="pure-button pure-button-primary addCart">Add to Cart</button></td>
</tr>`);


$(function() {
    console.log( "ready!" );
    // Setup delegated click handler 
    $( "#stock table tbody" ).on( "click", "tr button.addCart", function(evt) {
      evt.preventDefault();
      let qty = $( this ).siblings( ".qty" ).val();
      let price = $( this ).parents( "tr" ).find('.product_price').text();
      // console.log('price is: ', price);
      let productId = $( this ).siblings( ".productId" ).val();
      cart.push({
        userName: 'Vijay',  // TO BE FIXED UP LATER
        price: price,
        quantity: qty,
        productId: productId,
      })
      //console.log('cart details: ', cart);
    });

    $( ".checkout-btn" ).on( "click", function(evt) {
      console.log('clicked checkout button', cart);
      $.post({
        url: `${CHECKOUT_BASE_URL}/checkoutOrder`,
        data: JSON.stringify(cart),
        contentType: "application/json",
        dataType: "text" // Ideally, we should get jsons
      })
      .done(function(data, textStatus, jqXHR) {
        console.log("checkout successful",data);
        // clear existing cart items
        cart = [];
      })
      .fail(function( jqXHR, textStatus, errorThrown ) {
        console.error(errorThrown);
      });
    });

    $.get( `${STORE_BASE_URL}/products`, function( data ) {
      console.log( "Load was performed.", data.content );
      const table = $('#stock table tbody');
      data.content.forEach(product => {
        table.append(product_row_tmpl(product));
      });
    });
    console.log(cart.length);
    tinybind.binders.disabled = function(el, value) {
      // console.log("binding cart length",value);
      if(value === 0) {
        el.setAttribute("disabled", "disabled")
      } else {
        el.removeAttribute("disabled");
      }
    }
    tinybind.bind($(".cart-count"), {cart});
    tinybind.bind($(".checkout-btn"), {cart});
});