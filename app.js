let select_form = document.getElementById(`trivia`);
let select_inner_questions = document.getElementById(`inner_questions`);
let datos_Api;
let respuesta_click = [];
let puntaje = 0;

select_form.addEventListener(`submit`, (event) => {
  event.preventDefault();
  //   console.log(`trivia`);
  let cantidad = event.target.amount;
  let categoria = event.target.category;
  let dificultad = event.target.difficulty;
  let tipo = event.target.type;
  console.log(cantidad.value);
  console.log(categoria.value);
  console.log(dificultad.value);
  console.log(tipo.value);
  fetch(
    `https://opentdb.com/api.php?amount=${cantidad.value}&category=${categoria.value}&difficulty=${dificultad.value}&type=${tipo.value}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let resultado = data.results;
      insertar_temple_preguntas(resultado);
      datos_Api = resultado;
    });
});

const crear_plantilla_preguntas = (data, index, cantidadPreguntas) => {
  const respuestas = [...data.incorrect_answers, data.correct_answer];
  let templete_botone_respuestas = ``;
  for (let i = 0; i < respuestas.length; i++) {
    templete_botone_respuestas += `
    <buttom
      class="button elem_selects_answ" 
      data-indice="${index /* indice de la pregunta */}" 
      data-respuesta="${respuestas[i]}"
    >${respuestas[i]}</buttom>
  `;
  }
  return `
  <div class="content preguntas_sg" id="${index}">
    <p>${data.question}</p>
    <div class="question-items">
      <div style="width: 100%;">
        ${templete_botone_respuestas}
      </div>
    </div>
    <p>
      <span>${index + 1}</span> / <span>${cantidadPreguntas}</span>
    </p>
  </div>
  `;
};

const insertar_temple_preguntas = (data) => {
  let template_All_preguntas = ``;
  select_form.classList.add("d-none");

  data.forEach((element, i) => {
    template_All_preguntas += crear_plantilla_preguntas(
      element,
      i,
      data.length
    );
  });
  select_inner_questions.innerHTML += template_All_preguntas;
};
select_inner_questions.addEventListener(`click`, (e) => {
  if (e.target.classList.contains(`elem_selects_answ`)) {
    const indice_pregunta = e.target.dataset.indice;
    const respuesta_pregunta = e.target.dataset.respuesta;
    const pregunta_actual = datos_Api[indice_pregunta];
    if (pregunta_actual.correct_answer == respuesta_pregunta) {
      puntaje = puntaje + 1;
      document.getElementById(
        indice_pregunta
      ).style.backgroundColor = `#43e421`;
      document.getElementById(`success_audio`).play();
    } else {
      document.getElementById(
        indice_pregunta
      ).style.backgroundColor = `#f70404`;
      document.getElementById(`error_audio`).play();
    }
    if (!respuesta_click.includes(indice_pregunta)) {
      respuesta_click.push(indice_pregunta);
    }
    if (respuesta_click.length === datos_Api.length) {
      document.getElementById(`modal`).style.display = `flex`;
      document.getElementById(`inner_puntaje`).textContent = puntaje;
      if (puntaje >= respuesta_click.length / 2) {
        document.getElementById(
          `contenedor_modal`
        ).style.backgroundColor = `#43e421`;
        document.getElementById(`paso_prueba`).play();
      } else {
        document.getElementById(
          `contenedor_modal`
        ).style.backgroundColor = `#f70404`;
        document.getElementById(`no_paso_prueba`).play();
      }
    }
  }
});
document.getElementById("cerrar_modal").addEventListener("click", (e) => {
  document.getElementById("modal").style.display = "none";
});
