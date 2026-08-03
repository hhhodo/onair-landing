document.querySelectorAll('.svc-item__row').forEach(row => {
  row.addEventListener('click', () => {
    const item = row.closest('.svc-item');
    const isOpen = item.classList.contains('svc-item--open');
    document.querySelectorAll('.svc-item--open').forEach(el => el.classList.remove('svc-item--open'));
    if (!isOpen) item.classList.add('svc-item--open');
  });
});
