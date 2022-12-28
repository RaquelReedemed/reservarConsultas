const STORAGE ='consultas';
let arrayConsultas = [];


class Consultorio {
    constructor(id, fecha, nombre, apellido, sede, especialidades, horario) {
        this.id = id;
        this.fecha = fecha;
        this.nombre = nombre;
        this.apellido = apellido;
        this.sede = sede;
        this.especialidades = especialidades;
        this.horario = horario;
        this.precio = especialidades === 'Clinica Medica' ? 3000 * 1.21 : 5000 * 1.21;
    };
        
};

const newId = () => {
    let id = 1;
    while (arrayConsultas.some(el => el.id === id)) {
        id++
    }
    return id;
}



// tabla de union dom a js
const form = document.getElementById('form');
const contenedorArchivo = document.getElementById('archivo');
contenedorArchivo.className = 'clase';
const recuperarConsulta = localStorage.getItem(STORAGE);
const formError = document.getElementById('form-error');
const botonPagar = document.getElementById('pagar');
const contenedorModal = document.getElementById('modal');
const precioDolarText = document.getElementById('precio-dolar');
const toggle = document.getElementById('toggleDark');

//modo oscuro
const body = document.querySelector('body');
toggle.addEventListener('click', function() {
    this.classList.toggle('bi-moon');
    if(this.classList.toggle('bi-brightness-high-fill')) {
        body.style.background = 'white';
        body.style.transition = '2s';
    }else{
        body.style.background ='#d6d6d6';
        body.style.transition = '2s';
    }
})


//API precio dolar (navbar)

//funcion para ahorrarse colocar el .jason() a las dunc asincronas
const JSONResponse = async (data) => { //data es una promesa
    const response = await data;     //espera hasta q se resuelva la promesa
    return await response.json();     //se convierte la promesa en tipo json
}

const precioDolar = fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales');
const traerDolar = async () => {
    const respuesta = await JSONResponse(precioDolar);
    console.log(respuesta);
    const oficial = respuesta.find(dolar => dolar.casa.agencia === '349');
    precioDolarText.innerHTML = `Dolar Oficial : Compra $ ${oficial?.casa.compra}`
}
traerDolar();



  
// mostrar las reservas
      const mostrarConsultas = () => {
        let acumulador = '';
        arrayConsultas.forEach( el => {
            acumulador += `
            <tr>
        <td>${luxon.DateTime.fromISO(el.fecha).toFormat('dd-LL-yyyy')}</td>
        <td>${el.nombre.toUpperCase()} </td>
        <td>${el.apellido.toUpperCase()}</td>
        <td>${el.sede}</td>
        <td>${el.especialidades}</td>
        <td>${el.horario}</td>
        <td>$${el.precio.toLocaleString('de-DE', {style: 'currency', currency: 'ARS'})}</td>
        <td>
           <button onclick="eliminarProducto(${el.id})" type="button" class="btn btn-light">❌</button>  
        </td>
        
       </tr>
            `
        })
        contenedorArchivo.innerHTML = acumulador;
      }


   // eliminar productos

   const eliminarProducto = (id => {
    console.log('elimine el id: ' + id)
    const nuevaLista = arrayConsultas.filter((el) => el.id !== id); //elimina id diferentes
    arrayConsultas = nuevaLista;
    mostrarConsultas()  // llamara a la funcion y muestra el array sin el id repetido
    guardarEnStorage();
    Swal.fire('Reserva eliminada con exito'
    );
   });   


    //funcion para guardar en storage

const guardarEnStorage = () => {
    localStorage.setItem(STORAGE, JSON.stringify(arrayConsultas));
   }
 

   //funcion para pushear al array los ingresos del input
 const nuevaConsulta = (id, fecha, nombre, apellido, sede, especialidades, horario) => {
    arrayConsultas.push(new Consultorio(id, fecha, nombre, apellido, sede, especialidades, horario)); 
    console.log(arrayConsultas);
  }


    // inputs de usuarios (formulario)

const handleSubmit = (event) => {
//evitando que se envien datos al servidor y hace que no se recargue la pagina
    event.preventDefault();

//devuelver el elemento que genero el evento
    let {target} = event;
   
//aviso sobre falta de datos en el formulario
   if (!target.nombre.value || !target.apellido.value || !target.fecha.value || !target.sede.value || !target.especialidades.value || !target.horario.value){
    formError.style.display = 'block'
    return;
}
  
   nuevaConsulta(newId(),target.fecha.value, target.nombre.value, target.apellido.value, target.sede.value, target.especialidades.value, target.horario.value); 
   
//guardando array
      guardarEnStorage();

      mostrarConsultas();

//reseteo a estado inicial de formulario
   form.reset();
 };
 form.addEventListener('submit', handleSubmit);


      
   // funcion la cual muestra las consultas almacenadas en el localstorage cuando reinicia la pag
 
 const recuperarValorGuardado = () => {
    
    if (recuperarConsulta) {
        const consultasViejas = JSON.parse(recuperarConsulta);
        
        consultasViejas.forEach((el) => {
            nuevaConsulta(el.id, el.fecha, el.nombre, el.apellido, el.sede, el.especialidades, el.horario);
            console.log(consultasViejas);
        })
       mostrarConsultas();
    }}
recuperarValorGuardado();



console.log(arrayConsultas);



     //Mostrar Total a pagar

//const botonPagar = document.getElementById('pagar');
//const contenedorModal = document.getElementById('modal');

  botonPagar.addEventListener('click', () => {
     //metodo reduce recorre el array en su ejecucion y acumular en acc
     arrayConsultas.forEach ((el => {
        const res = arrayConsultas.reduce((acc, el) =>{
            return acc += el.precio;
        }, 0 );
         
        contenedorModal.innerHTML = `
        Estimado paciente
        el monto a abonar es de: ${res}$
        `;

        // Crea un objeto de preferencia
let preference = {
    items: [
      {
        title: "Mi producto",
        unit_price: 100,
        quantity: 1,
      },
    ],
  };
     }))
     
    console.log(contenedorModal.innerHTML);  
});  //${el.nombre}
 
/* const time = luxon.DateTime;

const ayer = time.local(2022, 12, 22, 01, 13);

const hoy = time.now();

console.log(hoy, 'hoy')
console.log(ayer);

console.log(hoy.toLocaleString(time.DATE_FULL))
 */

