const reservations = {};
let selectedSeats = [];
let totalPrice = 300; // Precio base inicial

document.querySelectorAll('.seatEconomic').forEach(button => {
    button.addEventListener('click', (event) => {
        const seatId = button.id;

        if (button.classList.contains('reserved')) {
            // Mostrar la información de la reserva existente si está definida
            document.getElementById('seat-id').value = seatId;
            document.getElementById('name').value = reservations[seatId].name || '';
            document.getElementById('nacimiento').value = reservations[seatId].nacimiento || '';
            document.getElementById('paisEmision').value = reservations[seatId].paisEmision || '';
            document.getElementById('numPasaporte').value = reservations[seatId].numPasaporte || '';
            document.getElementById('vencimientoPasaporte').value = reservations[seatId].vencimientoPasaporte || '';
            document.getElementById('sexo').value = reservations[seatId].sexo || '';

            // Deshabilitar los campos para mostrar la información
            disableFormFields();

            // Ocultar botones de reserva y limpieza
            document.getElementById('reserve-btn').style.display = 'none';
            document.getElementById('clear-btn').style.display = 'none';

            document.getElementById('reservationModalLabel').textContent = `Información de la reserva asiento ${seatId}`;
            new bootstrap.Modal(document.getElementById('reservation-modal')).show();

        } else {
            // Lógica para seleccionar/deseleccionar asientos
            if (selectedSeats.includes(button)) {
                button.classList.remove('selected');
                selectedSeats = selectedSeats.filter(seat => seat !== button);
            } else {
                button.classList.add('selected');
                selectedSeats.push(button);
            }
        }
    });
});

document.getElementById('reserve-selected').addEventListener('click', () => {
    if (selectedSeats.length > 0) {
        // Reiniciar el formulario
        document.getElementById('form').reset();
        enableFormFields();

        // Mostrar el modal para el primer asiento seleccionado
        showReservationModalForSeat(0);
    } else {
        alert('Por favor, selecciona al menos un asiento.');
    }
});

function showReservationModalForSeat(index) {
    if (index < selectedSeats.length) {
        const seat = selectedSeats[index];
        const seatId = seat.id;

        // Configurar el modal para el asiento actual
        document.getElementById('seat-id').value = seatId;
        document.getElementById('reservationModalLabel').textContent = `Información de la reserva asiento ${seatId}`;
        const modal = new bootstrap.Modal(document.getElementById('reservation-modal'));
        modal.show();

        // Al confirmar, guardar la información y pasar al siguiente asiento
        document.getElementById('reserve-btn').onclick = () => {
            const name = document.getElementById('name').value;
            const nacimiento = document.getElementById('nacimiento').value;
            const paisEmision = document.getElementById('paisEmision').value;
            const numPasaporte = document.getElementById('numPasaporte').value;
            const vencimientoPasaporte = document.getElementById('vencimientoPasaporte').value;
            const sexo = document.getElementById('sexo').value;

            if (name && nacimiento && paisEmision && numPasaporte && vencimientoPasaporte && sexo) {
                reservations[seatId] = { name, nacimiento, paisEmision, numPasaporte, vencimientoPasaporte, sexo };
                modal.hide();
                document.getElementById('form').reset();
                showReservationModalForSeat(index + 1);
            } else {
                alert('Por favor, completa todos los campos.');
            }
        };
    } else {
        // Mostrar el modal para la información de facturación
        showBillingModal();
    }
}

function enableFormFields() {
    const fields = ['name', 'nacimiento', 'paisEmision', 'numPasaporte', 'vencimientoPasaporte', 'sexo'];
    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.disabled = false;
        }
    });
}

function disableFormFields() {
    const fields = ['name', 'nacimiento', 'paisEmision', 'numPasaporte', 'vencimientoPasaporte', 'sexo'];
    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.disabled = true;
        }
    });
}

function showBillingModal() {
    const billingModal = new bootstrap.Modal(document.getElementById('billing-modal'));
    billingModal.show();


    document.getElementById('billing-submit').onclick = () => {
        const billingEmail = document.getElementById('billing-email').value;
        const billingPhone = document.getElementById('billing-phone').value;
        const billingAddress = document.getElementById('billing-address').value;
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCVC = document.getElementById('card-cvc').value;

        if (billingEmail && billingPhone && billingAddress && cardNumber && cardExpiry && cardCVC) {
            const billingInfo = { email: billingEmail, phone: billingPhone, address: billingAddress };
            createAccordion(billingInfo);
            billingModal.hide();

            // Marcar asientos como reservados después de completar la información de facturación
            selectedSeats.forEach(seat => {
                seat.classList.add('reserved');
                seat.classList.remove('selected');
            });

            // Limpiar selección de asientos y resetear reservas para próxima reserva
            selectedSeats = [];
            Object.keys(reservations).forEach(key => delete reservations[key]);

            // Limpiar formulario de facturación
            document.getElementById('billing-form').reset();
        } else {
            alert('Por favor, completa todos los campos de facturación.');
        }
    };
}

function createAccordion(billingInfo) {
    const accordion = document.getElementById('accordionReservations');

    const item = document.createElement('div');
    item.classList.add('accordion-item');

    const header = document.createElement('h2');
    header.classList.add('accordion-header');
    header.id = `heading-${Object.keys(reservations).length}`;
    header.innerHTML = `
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                data-bs-target="#collapse-${Object.keys(reservations).length}">
            ${billingInfo.email}
        </button>
    `;
    item.appendChild(header);

    const collapse = document.createElement('div');
    collapse.id = `collapse-${Object.keys(reservations).length}`;
    collapse.classList.add('accordion-collapse', 'collapse');
    collapse.setAttribute('aria-labelledby', `heading-${Object.keys(reservations).length}`);
    collapse.setAttribute('data-bs-parent', '#accordionReservations');

    const body = document.createElement('div');
    body.classList.add('accordion-body');

    let reservationDetails = '<ul>';
    for (const [seatId, details] of Object.entries(reservations)) {
        reservationDetails += `<li>Asiento: ${seatId} - Nombre: ${details.name}</li>`;
    }
    reservationDetails += '</ul>';

    body.innerHTML = reservationDetails;
    collapse.appendChild(body);

    item.appendChild(collapse);
    accordion.appendChild(item);

    
    // Botón para cancelar la reserva y liberar el asiento
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancelar vuelo';
    cancelBtn.classList.add('btn', 'btn-danger');
    cancelBtn.onclick = () => {
        // Eliminar la reserva del acordeón y del objeto `reservations`
        const lastSeatId = Object.keys(reservations).pop();
        delete reservations[lastSeatId];
        item.remove();

        

        
        


        
    };
    body.appendChild(cancelBtn);



}

// Función para actualizar el precio total según las selecciones de servicios adicionales
function updateTotalPrice() {
    let totalPrice = 300; // Restablecer el precio base
    

    // Verificar si se seleccionó maleta extra
    const extraCheckedLuggage = document.getElementById('extra-checked-luggage').checked;
    if (extraCheckedLuggage) {
        totalPrice += 50;
    }

    // verificar si se selecciono maleta de mano extra
    const extraHandLuggage = document.getElementById('extrados-checked-luggage').checked;
    if (extraHandLuggage) {
        totalPrice += 25;
    }

    // Verificar si se seleccionó wifi del avión
    const wifi = document.getElementById('wifi').checked;
    if (wifi) {
        totalPrice += 30;
    }

    // Mostrar el precio total actualizado en el formulario de facturación
    document.getElementById('total-price').textContent = `Precio total: $${totalPrice}`;
    document.getElementById('total-amount').value = `$${totalPrice}`;
    
    console.log(totalPrice);
}
// Event listeners para los checkboxes
document.getElementById('extra-checked-luggage').addEventListener('change', updateTotalPrice);
document.getElementById('extrados-checked-luggage').addEventListener('change', updateTotalPrice);
document.getElementById('wifi').addEventListener('change', updateTotalPrice);

// Mostrar el precio total inicial al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('total-amount').value = `$${totalPrice}`;
});

function validateNumber(input) {
    input.value = input.value.replace(/\D/g, '');
    const countryCode = document.getElementById('countryCode').value;
    const phoneLengths = {
        "+1": 10,
        "+34": 9,
        "+52": 10,
        "+57": 10,
        "+54": 10,
        "+56": 9,
        "+593": 9,
        "+51": 9,
        "+58": 10,
        "+49": 11, // Alemania
        "+33": 9, // Francia
        "+39": 10, // Italia
        "+55": 10, // Brasil
        "+81": 10, // Japón
        "+86": 11, // China
        "+91": 10, // India
        "+61": 9, // Australia
        "+27": 9, // Sudáfrica
        "+7": 10, // Rusia
        "+82": 10, // Corea del Sur
        "+90": 10, // Turquía
        "+351" : 9, // Portugal
        "+31" : 9, // Países Bajos
        "+20"  : 10, // Egipto
        "+234"  : 10, // Nigeria
        "+212"  : 10, // Marruecos
        "+213"  : 10, // Argelia
        "+225"  : 10, // Costa de Marfil
        "+506"  : 8, // Costa Rica
        "+254" : 9, // Kenia
        "+256" : 9, // Uganda
        "+233" : 9, // Ghana
        "+237" : 9, // Camerún
        "+221" : 9, // Senegal
        "+255" : 9, // Tanzania
        "+249"  : 9, // Sudán
        "+216"  : 8, // Túnez
        "+218" : 9, // Libia
    };

    if (input.value.length !== phoneLengths[countryCode]) {
        input.value = input.value.slice(0, phoneLengths[countryCode]);
    }
    document.getElementById('countryCode').addEventListener('change', () => {
        document.getElementById('billing-phone').value = '';
    });
}
