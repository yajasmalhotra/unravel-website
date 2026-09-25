const menuButton=document.getElementById('menu-toggle');
const menu=document.getElementById('site-menu');
const header=document.getElementById('site-header');
function setMenu(open){menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.querySelector('.menu-label').textContent=open?'Close':'Menu';menuButton.querySelector('.menu-plus').textContent=open?'×':'+';menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.style.overflow=open?'hidden':''}
menuButton.addEventListener('click',()=>setMenu(menu.hidden));
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
header.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{if(!menu.hidden)setMenu(false)}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden)setMenu(false)});
const syncHeader=()=>header.classList.toggle('scrolled',window.scrollY>24);
window.addEventListener('scroll',syncHeader,{passive:true});
syncHeader();
const questions=document.querySelector('.faq-cards');
document.querySelectorAll('.carousel-arrow').forEach(button=>button.addEventListener('click',()=>questions.scrollBy({left:(button.dataset.scroll==='next'?1:-1)*(questions.querySelector('article').getBoundingClientRect().width+14),behavior:'smooth'})));
