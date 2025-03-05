/** @odoo-module */

import { Order, Orderline, Payment } from "@point_of_sale/app/store/models";
import { patch } from "@web/core/utils/patch";

patch(Order.prototype, {

    setup() {
        super.setup(...arguments);
        
        var default_customer = this.pos.config.res_partner_id;
        var default_customer_by_id = this.pos.db.get_partner_by_id(default_customer[0]);
        
        if(default_customer_by_id){
            this.set_partner(default_customer_by_id);
        } else{
            this.set_partner(null);
        }

        //Cambios en el POS
        this.changePos(this.pos);
    },

    
    
    changePos(pos){
        // Crear un MutationObserver para observar cambios en el DOM
        const observer = new MutationObserver(() => {            
            //La vista uno es el inicio del POS
            this.camposDeLaVistaUno(pos);
            //La vista dos es cuando se da al boton pagar del POS donde muestra los metodos de pago
            this.camposDeLaVistaDos();

            //La vista tres es cuando aparece el boton para siguiente orden
            this.camposDeLaVistaTres();
        });

        // Observar cambios en el DOM dentro del contenedor principal
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },


    

        




    insert_generate_load_view(){
        // Crear un div para el spinner
        var spinner = document.createElement('div');
        spinner.id = 'loader_qhuantuy';
        spinner.style.position = 'fixed';
        spinner.style.top = '0';
        spinner.style.left = '0';
        spinner.style.width = '100%';
        spinner.style.height = '100%';
        spinner.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        spinner.style.zIndex = '9999';
        spinner.style.display = 'flex';
        spinner.style.justifyContent = 'center';
        spinner.style.alignItems = 'center';

        // Añadir texto o un spinner de carga
        spinner.innerHTML = '<div class="loader" style="border: 16px solid #f3f3f3; border-top: 16px solid #3498db; border-radius: 50%; width: 60px; height: 60px; animation: spin 2s linear infinite;"></div>';

        // Estilos de la animación
        var style = document.createElement('style');
        style.innerHTML = `
        @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
        }
        `;
        document.head.appendChild(style);
        // Añadir el spinner al cuerpo
        document.body.appendChild(spinner);
    },

    remove_generate_load_view(){
        //buscar el loader
        var spinner = document.getElementById('loader_qhuantuy');
        // Eliminar el spinner
        document.body.removeChild(spinner);
    },

    camposDeLaVistaTres(){
        const buttonValidate = document.querySelector('.button.next.validation');
        if (buttonValidate && buttonValidate.textContent.trim() === "Nueva orden") {
            const campo_receipt = document.querySelector('.pos-receipt-container');
            if(campo_receipt){
                campo_receipt.setAttribute('style', 'display: none !important;');
            }
            const campo_pago_exitoso = document.querySelector('.d-flex.flex-column.m-4');
            if(campo_pago_exitoso){
                campo_pago_exitoso.setAttribute('style', 'display: none !important;');
            }
            const campo_monto = document.querySelector('.top-content.d-flex');
            if(campo_monto){
                campo_monto.setAttribute('style', 'display: none !important;');
            }
            this.center_button_next_order(buttonValidate);
        }else{
            //para tablets pequenas
            const buttonValidate1 = document.querySelector('.btn-switchpane.validation-button');
            if(buttonValidate1 && buttonValidate1.textContent.trim() === "Nueva orden"){
                const campo_receipt = document.querySelector('.pos-receipt-container');
                if(campo_receipt){
                    campo_receipt.setAttribute('style', 'display: none !important;');
                }
                const campo_pago_exitoso = document.querySelector('.d-flex.flex-column.m-4');
                if(campo_pago_exitoso){
                    campo_pago_exitoso.setAttribute('style', 'display: none !important;');
                }
                const campo_monto = document.querySelector('.top-content.d-flex');
                if(campo_monto){
                    campo_monto.setAttribute('style', 'display: none !important;');
                }
                this.center_button_next_order(buttonValidate1);
            }
        }
    },

    center_button_next_order(button_next_order){
        button_next_order.setAttribute('style', 'position: fixed !important; top: 30% !important; left: 0 !important; width: 100% !important; height: 25% !important; display: flex !important; justify-content: center !important; align-items: center !important; z-index: 1000 !important;');
    },
    
    camposDeLaVistaUno(pos){
        // Buscar y cambiar el campo donde esta el logo de odoo
        //PASA ALGO ACA HAY Q LEER BIEN EL CODIGO
        this.changeLogoandAddText();

        // Ocultar el user wifi and menu
        //this.hideUserWifiAndMenu();
        // Ocultar el boton del cliente
        this.hideChangeCustomerButton();
        //redimencionar el boton de pago
        this.resizePayButton();
        //ocultar el boton mas si esta con otro tamano de pantalla celular
        this.hidemorebuttos();
        //activar camara
        //this.onCamera(pos);
    },

    camposDeLaVistaDos(){
        //ocultar campos del payment-screen
        this.paymentScreenHideCustomerAndFacturationZone();
        this.paymentScreenHideNumpad();
        this.repositionAllView();
    },
    
    repositionAllView(){
        //const mainContent = document.querySelector('.main-content.d-flex.overflow-auto.h-100');
        const main_content = document.querySelector('.main-content');
        if (main_content) {
            main_content.classList.remove('d-flex');
            const left_content = main_content.querySelector('.left-content');
            const center_content = main_content.querySelector('.center-content');
            //ordenarlo de primero y segundo
            if (left_content && center_content){
                main_content.setAttribute('style', 'display: flex; flex-direction: column;');
                left_content.setAttribute('style', 'order: 2;');
                center_content.setAttribute('style', 'order: 1;');
            }
            if(left_content){
                const paymentmethods = left_content.querySelector('.paymentmethods');
                if (paymentmethods) {
                    paymentmethods.classList.remove('d-flex');
                    paymentmethods.classList.remove('flex-column');
                }
                left_content.classList.remove('w-25');

                const paymentMethodButtons = left_content.querySelectorAll('.button.paymentmethod.btn.btn-light.rounded-0.border-bottom');
                paymentMethodButtons.forEach(btn => {
                    btn.style.width = '50%';
                });
            }

            const button_validate = main_content.querySelector('.button.next.validation.btn.btn-primary');
            button_validate.setAttribute('style', 'display: none !important;');

        }else{
            const switchpane = document.querySelector('.switchpane.d-flex.h-12');
            if(switchpane && !switchpane.hasAttribute('style') && switchpane.textContent.trim() != "Nueva orden"){
                switchpane.setAttribute('style', 'display: none !important;');
            }
        }
    },

    hideUserWifiAndMenu(){
        //boton usuario y wifi
        const status_buttons = document.querySelector('.status-buttons');
        if(status_buttons){
            status_buttons.setAttribute('style', 'display: none !important;');
        }
        //boton usuario y wifi
        const menu_navbar = document.querySelector('.navbar-button.menu-button');
        if(menu_navbar){
            menu_navbar.setAttribute('style', 'display: none !important;');
        }
    },

    drawNewLogoAndText(pos_branding){
        //const html_add = '<div class="pos-branding d-flex justify-content-start flex-grow-1 h-100 p-0 my-0 text-start" style="max-width: 100% !important; width: 100% !important;"><img class="pos-logo h-75 ms-3 me-auto align-self-center" src="/web/static/img/logo.png" alt="Logo" style="display: none;"><div class="d-flex flex-md-row align-items-center justify-content-center" style="width: 100%;"><span class="mt-3 mt-md-0 ms-md-3 text-center" style="font-size: 24px; font-weight: bold;">POR FAVOR, ESCANEE SUS PRODUCTOS</span><img src="/bi_pos_default_customer_and_hide_areas/static/description/logo_hotbox.jpg" alt="NewLogo" class="img-fluid" style="max-width: 150px;"></div></div>';
        const html_add = '<div class="pos-branding d-flex justify-content-start flex-grow-1 h-100 p-0 my-0 text-start" style="max-width: 100% !important; width: 100% !important;"><img class="pos-logo h-75 ms-3 me-auto align-self-center" src="/web/static/img/logo.png" alt="Logo" style="display: none;"><div class="d-flex flex-md-row align-items-center justify-content-center" style="width: 100%;"><img src="/bi_pos_default_customer_and_hide_areas/static/description/logo_hotbox.jpg" alt="NewLogo" class="img-fluid" style="max-width: 150px;"><span class="mt-3 mt-md-0 ms-md-3 text-center" style="font-size: 24px; font-weight: bold;">POR FAVOR, ESCANEE SUS PRODUCTOS</span></div></div>';
        // Insertar el HTML directamente
        pos_branding.insertAdjacentHTML('afterbegin', html_add);
    },
    
    changeLogoandAddText(){
        //buscar el menu superior del pos
        const mainContent = document.querySelector('.pos-topheader');
        if (mainContent) {
            mainContent.setAttribute('style', 'height: 90px !important;');
            //buscar el campo donde esta el logo de odoo
            const pos_branding = mainContent.querySelector('.pos-branding');
            const pos_rightheader = mainContent.querySelector('.pos-rightheader');
            //pasa que al poner grande la pantalla y luego cambias a movil se cachea el logo
            const logo_cacheado = pos_rightheader.querySelector('.pos-branding.d-flex.justify-content-start.flex-grow-1');
            
            if(pos_branding){
                // Seleccionar el elemento img
                const logo = pos_branding.querySelector('.pos-logo');
                // Verificar tiene el estilo none activado
                const have_styles = logo.hasAttribute('style');
                
                if (!have_styles) {
                    // Si el div existe, lo elimina
                    if (logo_cacheado) {
                        logo_cacheado.remove();
                    }
                    // Ocultar la imagen antigua
                    logo.style.display = 'none';
                    //dibujar el nuevo logo
                    this.drawNewLogoAndText(pos_branding);
                }
                //remover el pos branding
                //pos_branding.remove()
                //colocar el nuevo logo
                //this.drawNewLogoAndText(mainContent);
            }else{
                if (pos_rightheader) {
                    //colocar el nuevo logo
                    this.drawNewLogoAndText(pos_rightheader);
                }
            }
        }
    },

    hideChangeCustomerButton() {
        const changeCustomerButton = document.querySelector('button.button.set-partner');
        if (changeCustomerButton) {
            changeCustomerButton.style.display = 'none';
        }
    },

    resizePayButton() {
        const payButton = document.querySelector('button.pay-order-button');
        if (payButton) {
            payButton.style.width = "100%";
            payButton.style.height = "100%";
        }
        const actionpadDiv = document.querySelector('div.actionpad.d-flex.flex-column.flex-grow-1.mw-50.p-0.border-end');
        if (actionpadDiv) {
            actionpadDiv.classList.remove('mw-50');
        }
    },

    hidemorebuttos(){
        const changeCustomerButton = document.querySelector('button.button.mobile-more-button.btn.btn-secondary.flex-fill.border-bottom');
        if (changeCustomerButton) {
            changeCustomerButton.style.display = 'none';
        }
    },

    paymentScreenHideCustomerAndFacturationZone() {
        /*
        const mainContent = document.querySelector('.main-content.d-flex.overflow-auto.h-100');
        if (mainContent) {
            // Ocultar el div con la clase específica dentro del contenedor principal
            const divToHide = mainContent.querySelector('.right-content.w-25.bg-400');
            if (divToHide) {
                // Verificar tiene el estilo none activado
                const have_styles = divToHide.hasAttribute('style');
                // Llamar a la función solo si el color de fondo no era rojo
                if (!have_styles) {
                    //Simulo que el boton de factura fue presionado
                    this.simulateButtonClickFacturaccion();
                    divToHide.style.display = 'none';
                }
            }
        }
        */
        const mainContent = document.querySelector('.main-content.d-flex.overflow-auto.h-100');
        
        if (mainContent) {
            // Ocultar el div con la clase específica dentro del contenedor principal
            const divToHide = mainContent.querySelector('.right-content.w-25.bg-400');
            if (divToHide) {
                this.hideCustomerAndFacturationZone(divToHide);
            }
        }
        else {
            const mainContent = document.querySelector('.payment-buttons.d-flex.flex-column.flex-wrap');
            if (mainContent) {
                this.hideCustomerAndFacturationZone(mainContent);
            }
        }
    },

    hideCustomerAndFacturationZone(zone){
        // Verificar tiene el estilo none activado
        const have_styles = zone.hasAttribute('style');
        // Llamar a la función solo si el color de fondo no era rojo
        if (!have_styles) {
            //Simulo que el boton de factura fue presionado
            this.simulateButtonClickFacturaccion();
            //ocultar el campo
            zone.setAttribute('style', 'display: none !important;');
        }
    },

    simulateButtonClickFacturaccion() {
        /*
        const button = document.querySelector('.button.js_invoice.btn.btn-light.py-3.text-start.rounded-0.border-bottom');
        if (button) {
            button.click(); // Simula un clic en el botón de "Factura"
        }
        */
        const button = document.querySelector('.button.js_invoice.btn.btn-light.py-3.text-start.rounded-0.border-bottom');
        if ( button && !button.classList.contains('highlight') && !button.classList.contains('text-bg-primary') ) {
            button.click(); // Simula un clic en el botón de "Factura"
        }
    },

    paymentScreenHideNumpad() {
        const mainContent = document.querySelector('.main-content.d-flex.overflow-auto.h-100');

        if (mainContent) {
            // Buscar el contenedor secundario que contiene el div que queremos eliminar
            const centerContent = mainContent.querySelector('.center-content.d-flex.flex-column.w-50.p-1.border-start.border-end.bg-300');
            
            if (centerContent) {

                centerContent.classList.remove('w-50'); //elimino esto en el div
                centerContent.classList.add('w-100'); //adiciono esto en el div

                // Buscar y eliminar el div con las clases específicas dentro de centerContent
                const divToRemove = centerContent.querySelector('.flex-grow-1.numpad.row.row-cols-4.gx-0');
                if (divToRemove) {
                    divToRemove.remove(); // Eliminar el div del DOM
                }
            }
        }
    },

    onCamera(pos){
        const mainContent = document.querySelector('#cam-scaner');
        if (mainContent && !mainContent.querySelector('video')) {
            //console.log("iniciar camara");
            this.oncamera1(pos);
        }    
    },

    async oncamera1(pos){
        let lastDetectionTime = 0;
        const detectionInterval = 7000; // 7,000 milisegundos 

        const camScanner = document.querySelector("#cam-scaner");
        
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: camScanner,
                constraints: {
                    width: 640,
                    height: "30vw",
                    //width: width,   // Get width of the div
                    //height: height, // Get height of the div
                    facingMode: "enviroment",
                    //aspectRatio: { min: 1, max: 2 },
                },
                area: { // Para especificar un área de escaneo si es necesario
                    top: "0%",    // Área de escaneo desde el borde superior
                    right: "0%",  // Área de escaneo desde el borde derecho
                    bottom: "0%", // Área de escaneo desde el borde inferior
                    left: "0%"    // Área de escaneo desde el borde izquierdo
                }
            },
            decode:{
                //readers:["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader"],
                readers:["code_128_reader"],
            }
        },function(err){
            if(err){
                //console.log(err)
                return;
            }
            //console.log("QuaggJS iniciado con exito");
            Quagga.start();

            const canvas = document.querySelector("canvas");
            canvas.setAttribute('style', 'display: none !important;');

            const video = document.querySelector("video");
            video.setAttribute('style', 'height: 40vh !important;');
        });
        
        Quagga.onDetected(async (result) => {
            const currentTime = Date.now();
            // Verificar si ha pasado el intervalo de tiempo desde la última detección
            if (currentTime - lastDetectionTime >= detectionInterval) { //
                //obtencion de codigo de barra
                var barcode = result.codeResult.code;
                console.log("Código detectado.: ", barcode);
                // Actualizar el tiempo de la última detección
                lastDetectionTime = currentTime; //
                // Detectar el producto y introducirlo a la orden
                await this.handleDetection(barcode, pos, detectionInterval);
            }//
            // Aquí puedes colocar código adicional si es necesario después de que handleDetection termine
        });
    },

    async handleDetection(barcode, pos, detectionInterval) {
        // Busco y adiciono el producto escaneado
        var product = pos.db.get_product_by_barcode(barcode);
        var order = pos.get_order();
        if (product) {
            order.add_product(product);
            // Mostrar el div con id "cam-scaner-success-logo"
            var successDiv = document.getElementById('cam-scaner-success-logo');
            successDiv.style.display = 'block';
            // Esperar
            await new Promise(resolve => setTimeout(resolve, detectionInterval));
            // Ocultar el div nuevamente después de 5 segundos
            successDiv.style.display = 'none';
            // Aquí puedes continuar con la ejecución de otros scripts si es necesario
        }
    },

    sendAutomaticData(){
        // cuando precione el boton pago de pago se presionara send automaticamente
        // a la maquina y esperara el pago la validacion, cuando se confirme el proceso se 
        //debe automaticamente presionara el bonton de validar
    },

});