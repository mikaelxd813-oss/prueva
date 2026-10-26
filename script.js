/**
 * ==========================================================================
 * REPOSTERÍA MyG - SCRIPT PRINCIPAL
 * Interacciones: Menú Móvil, Filtros, Pedidos WhatsApp, Galería Lightbox, Contacto
 * WhatsApp Oficial: +591 69120470 | TikTok: @awm283
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
    const WHATSAPP_PHONE = "59169120470";

    /* ==========================================================================
       1. MENÚ DE NAVEGACIÓN MÓVIL Y ACCESIBILIDAD
       ========================================================================== */
    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle("active");
            menuBtn.setAttribute("aria-expanded", isOpen);
        });

        // Cerrar menú al hacer clic en un enlace de navegación
        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                navMenu.classList.remove("active");
                if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener("click", function (event) {
            if (!navMenu.contains(event.target) && !menuBtn.contains(event.target)) {
                navMenu.classList.remove("active");
                menuBtn.setAttribute("aria-expanded", "false");
            }
        });

        // Cerrar con tecla Escape
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                navMenu.classList.remove("active");
                if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ==========================================================================
       2. SCROLL SPY (INDICADOR DE SECCIÓN ACTIVA EN NAVBAR)
       ========================================================================== */
    const sections = document.querySelectorAll("section[id]");

    function updateActiveNavLink() {
        const scrollPosition = window.pageYOffset + 120;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === "#" + sectionId) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", updateActiveNavLink, { passive: true });

    /* ==========================================================================
       3. FILTROS DE PRODUCTOS EN EL CATÁLOGO
       ========================================================================== */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const productCards = document.querySelectorAll(".product-card");

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            // Actualizar estilo del botón activo
            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });
            button.classList.add("active");

            const selectedCategory = button.getAttribute("data-category");

            // Mostrar u ocultar productos según categoría
            productCards.forEach(function (card) {
                const cardCategory = card.getAttribute("data-category");

                if (selectedCategory === "todos" || cardCategory === selectedCategory) {
                    card.style.display = "flex";
                    setTimeout(function () {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(10px)";
                    setTimeout(function () {
                        card.style.display = "none";
                    }, 200);
                }
            });
        });
    });

    /* ==========================================================================
       4. SISTEMA DE PEDIDOS Y MODAL RÁPIDO
       ========================================================================== */
    const orderModal = document.getElementById("orderModal");
    const closeOrderModalBtn = document.getElementById("closeOrderModal");
    const selectedProductNameEl = document.getElementById("selectedProductName");
    const selectedProductPriceEl = document.getElementById("selectedProductPrice");
    const orderNameInput = document.getElementById("orderName");
    const orderQtyInput = document.getElementById("orderQuantity");
    const orderDateInput = document.getElementById("orderDate");
    const orderDetailsInput = document.getElementById("orderDetails");
    const confirmOrderBtn = document.getElementById("confirmOrderBtn");

    let currentProductName = "";
    let currentProductPrice = "";

    // Botones para abrir el modal de pedido
    const orderModalButtons = document.querySelectorAll(".btn-open-order-modal");
    orderModalButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            currentProductName = btn.getAttribute("data-product") || "Producto de Repostería";
            currentProductPrice = btn.getAttribute("data-price") || "Consultar";

            if (selectedProductNameEl) selectedProductNameEl.textContent = currentProductName;
            if (selectedProductPriceEl) selectedProductPriceEl.textContent = currentProductPrice;
            if (orderQtyInput) orderQtyInput.value = "1";
            if (orderDateInput) orderDateInput.value = "";
            if (orderDetailsInput) orderDetailsInput.value = "";

            if (orderModal) {
                orderModal.classList.add("active");
                if (orderNameInput) orderNameInput.focus();
            }
        });
    });

    // Control de incremento / decremento de cantidad
    const qtyMinusBtn = document.getElementById("qtyMinus");
    const qtyPlusBtn = document.getElementById("qtyPlus");

    if (qtyMinusBtn && orderQtyInput) {
        qtyMinusBtn.addEventListener("click", function () {
            let val = parseInt(orderQtyInput.value, 10) || 1;
            if (val > 1) orderQtyInput.value = val - 1;
        });
    }

    if (qtyPlusBtn && orderQtyInput) {
        qtyPlusBtn.addEventListener("click", function () {
            let val = parseInt(orderQtyInput.value, 10) || 1;
            orderQtyInput.value = val + 1;
        });
    }

    // Cerrar modal de pedido
    function closeOrderModal() {
        if (orderModal) orderModal.classList.remove("active");
    }

    if (closeOrderModalBtn) {
        closeOrderModalBtn.addEventListener("click", closeOrderModal);
    }

    if (orderModal) {
        orderModal.addEventListener("click", function (event) {
            if (event.target === orderModal) {
                closeOrderModal();
            }
        });
    }

    // Confirmar pedido y enviar a WhatsApp
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener("click", function () {
            const customerName = orderNameInput ? orderNameInput.value.trim() : "";
            const quantity = orderQtyInput ? orderQtyInput.value.trim() : "1";
            const eventDate = orderDateInput ? orderDateInput.value.trim() : "";
            const notes = orderDetailsInput ? orderDetailsInput.value.trim() : "";

            if (!customerName) {
                alert("Por favor, ingresa tu nombre para que podamos atenderte con cariño.");
                if (orderNameInput) orderNameInput.focus();
                return;
            }

            // Construir mensaje estructurado para WhatsApp
            let message = `¡Hola Repostería MyG! 🎂 Quiero realizar un pedido:\n\n`;
            message += `*Producto:* ${currentProductName}\n`;
            message += `*Cantidad:* ${quantity}\n`;
            message += `*Cliente:* ${customerName}\n`;
            if (eventDate) message += `*Fecha deseada / Ocasión:* ${eventDate}\n`;
            if (notes) message += `*Detalles o decoración:* ${notes}\n`;
            message += `\n¿Tienen disponibilidad y cómo coordinamos el pago o entrega? ¡Muchas gracias!`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

            // Abrir WhatsApp en nueva pestaña
            window.open(whatsappUrl, "_blank", "noopener,noreferrer");

            // Cerrar modal y limpiar
            closeOrderModal();
        });
    }

    /* ==========================================================================
       5. CONSULTA DIRECTA DE PRODUCTOS POR WHATSAPP
       ========================================================================== */
    const directInquiryButtons = document.querySelectorAll(".btn-inquire-whatsapp");
    directInquiryButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const productName = btn.getAttribute("data-product") || "un producto";
            const message = `¡Hola Repostería MyG! 🍰 Me gustaría consultar sobre *${productName}*. ¿Podrían enviarme información sobre disponibilidad, tamaños y precios?`;
            const encoded = encodeURIComponent(message);
            const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
            window.open(url, "_blank", "noopener,noreferrer");
        });
    });

    /* ==========================================================================
       6. LIGHTBOX PARA GALERÍA DE FOTOS
       ========================================================================== */
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxSub = document.getElementById("lightboxSub");
    const closeLightboxBtn = document.getElementById("closeLightbox");
    const lightboxWhatsappBtn = document.getElementById("lightboxWhatsappBtn");

    galleryItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const img = item.querySelector("img");
            const title = item.getAttribute("data-title") || "Creación MyG";
            const category = item.getAttribute("data-category-name") || "Repostería Artesanal";

            if (img && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || title;
            }
            if (lightboxCaption) lightboxCaption.textContent = title;
            if (lightboxSub) lightboxSub.textContent = category;

            if (lightboxWhatsappBtn) {
                const message = `¡Hola Repostería MyG! 🧁 Vi esta foto en su galería (*${title}*) y me gustaría consultar si pueden prepararme un diseño similar. ¿Me podrían dar detalles y precios?`;
                lightboxWhatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
            }

            if (lightboxModal) {
                lightboxModal.classList.add("active");
            }
        });
    });

    function closeLightbox() {
        if (lightboxModal) lightboxModal.classList.remove("active");
    }

    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener("click", closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener("click", function (e) {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    // Tecla Escape para cerrar modales
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeOrderModal();
            closeLightbox();
        }
    });

    /* ==========================================================================
       7. FORMULARIO DE CONTACTO (ENVÍO CONECTADO A WHATSAPP Y CONFIRMACIÓN)
       ========================================================================== */
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("contactName").value.trim();
            const phone = document.getElementById("contactPhone").value.trim();
            const message = document.getElementById("contactMessage").value.trim();

            if (!name || !phone || !message) {
                alert("Por favor, completa todos los campos del formulario.");
                return;
            }

            // Preguntar al usuario si desea enviar directo a WhatsApp para atención inmediata
            const sendViaWhatsApp = confirm(
                `¡Gracias ${name}!\n\n¿Deseas enviar tu mensaje directamente al WhatsApp de Repostería MyG para recibir una respuesta más rápida?`
            );

            if (sendViaWhatsApp) {
                const waMessage = `¡Hola Repostería MyG! 💌 Les escribo desde el formulario web:\n\n*Nombre:* ${name}\n*Teléfono:* ${phone}\n*Mensaje:* ${message}`;
                const encoded = encodeURIComponent(waMessage);
                const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
                window.open(url, "_blank", "noopener,noreferrer");
            } else {
                alert(`¡Gracias por comunicarte con Repostería MyG, ${name}! Hemos recibido tu información y te contactaremos a la brevedad.`);
            }

            contactForm.reset();
        });
    }

    /* ==========================================================================
       8. SELECCIÓN INTELIGENTE DE TIKTOK EN DISPOSITIVOS MÓVILES
       ========================================================================== */
    const tiktokLinks = document.querySelectorAll(".tiktok-link");
    tiktokLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            // El enlace por defecto https://www.tiktok.com/@awm283 con target="_blank"
            // es el estándar que el sistema operativo móvil (Android e iOS)
            // asocia a la app nativa de TikTok automáticamente si está instalada.
        });
    });
});