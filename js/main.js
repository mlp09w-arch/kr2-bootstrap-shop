'use strict';
const models = {
  green: {name:'Лайм', price:3490, category:'Рабочая', description:'Регулируемый кронштейн, металлический корпус и яркий цвет.', badge:'Новинка', specs:[['Материал','Металл'],['Цвет','Зелёный'],['Высота','До 70 см'],['Цоколь','E27'],['Мощность','До 60 Вт'],['Гарантия','1 год']]},
  beige: {name:'Классика', price:5990, category:'Классическая', description:'Тканевый абажур и золотистое основание для уютного вечера.', badge:'', specs:[['Абажур','Ткань'],['Цвет','Бежевый, золотистый'],['Стиль','Классический']]},
  black: {name:'Нуар', price:6490, category:'Классическая', description:'Чёрный абажур и рельефное стеклянное основание.', badge:'', specs:[['Основание','Рельефное стекло'],['Цвет','Чёрный'],['Стиль','Классический']]},
  bird: {name:'Лесная птица', price:8990, category:'Декоративная', description:'Деревянный корпус, фигурный плафон и тёплый свет.', badge:'Хит', specs:[['Корпус','Дерево'],['Дизайн','Фигурный плафон'],['Назначение','Декоративное освещение']]}
};
const money = value => new Intl.NumberFormat('ru-RU').format(value)+' ₽';
const requestedModel = new URLSearchParams(location.search).get('model');
const validModel = Object.hasOwn(models, requestedModel) ? requestedModel : 'green';
if (document.getElementById('detail-image')) {
  const model = models[validModel];
  document.title = `Лампа «${model.name}» — СветДом`;
  document.querySelectorAll('[data-model-name]').forEach(el => el.textContent = model.name);
  const img = document.getElementById('detail-image'); img.src = `images/lamp-${validModel}.webp`; img.alt = `Настольная лампа ${model.name}`;
  document.getElementById('detail-category').textContent = model.category+' лампа';
  document.getElementById('detail-description').textContent = model.description;
  document.getElementById('detail-price').textContent = money(model.price);
  const badge = document.getElementById('detail-badge'); badge.textContent = model.badge; badge.hidden = !model.badge;
  document.getElementById('detail-order').href = `order.html?model=${validModel}#order-form`;
  document.getElementById('spec-caption').textContent = `Характеристики лампы «${model.name}»`;
  const tbody = document.getElementById('spec-body'); tbody.replaceChildren();
  model.specs.forEach(([label, value]) => {const row=document.createElement('tr');const th=document.createElement('th');th.scope='row';th.textContent=label;const td=document.createElement('td');td.textContent=value;row.append(th,td);tbody.append(row);});
}
const filters = document.getElementById('filters');
if (filters) {
  const entries = Array.from(document.querySelectorAll('[data-product]'));
  const grid = document.querySelector('#catalog-products .row');
  const category = document.getElementById('category');
  const max = document.getElementById('max-price');
  const sort = document.getElementById('sort');
  function updateCatalog() {
    let count=0;
    entries.forEach(el=>{el.hidden=!!((category.value && el.dataset.category!==category.value)||(max.value!=='' && Number(el.dataset.price)>Number(max.value))); if(!el.hidden)count++;});
    const ordered=[...entries];
    if(sort.value!=='default')ordered.sort((a,b)=>(Number(a.dataset.price)-Number(b.dataset.price))*(sort.value==='asc'?1:-1));
    ordered.forEach(el=>grid.append(el));
    document.getElementById('result-count').textContent=count;
    document.getElementById('empty-results').hidden=count!==0;
  }
  filters.addEventListener('submit',e=>e.preventDefault());
  filters.addEventListener('input',updateCatalog);
  filters.addEventListener('reset',()=>{sort.value='default';setTimeout(updateCatalog,0);});
  sort.addEventListener('change',updateCatalog);
}
const form = document.getElementById('order-form');
if(form){
  const modelInput=document.getElementById('model');
  const quantity=document.getElementById('quantity');
  const delivery=document.getElementById('delivery');
  const address=document.getElementById('address');
  const result=document.getElementById('order-result');
  if(Object.hasOwn(models,requestedModel))modelInput.value=requestedModel;
  function updateOrder(){
    const model=models[modelInput.value];
    const count=Number(quantity.value);
    const validCount=Number.isInteger(count)&&count>=1&&count<=10;
    const subtotal=model&&validCount?model.price*count:0;
    const courier=delivery.value==='courier';
    const shipping=courier&&subtotal>0&&subtotal<7000?350:0;
    address.required=courier; address.disabled=!courier;
    document.getElementById('address-field').hidden=!courier;
    document.getElementById('summary-model').textContent=model?`${model.name} · ${validCount?count:'—'} шт.`:'Выберите лампу в форме.';
    document.getElementById('subtotal').textContent=money(subtotal);
    document.getElementById('shipping').textContent=money(shipping);
    document.getElementById('total').textContent=money(subtotal+shipping);
    result.hidden=true;
  }
  form.addEventListener('input',updateOrder);form.addEventListener('change',updateOrder);
  form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;result.textContent='Заявка проверена. Это демонстрация: заказ не создан, данные не отправлены.';result.hidden=false;result.focus();});
  updateOrder();
}
