// Sidebar resize functionality
export function initSidebarResize() {
  const sidebar = /** @type {HTMLElement} */ (document.querySelector('.sidebar'));
  const resizeHandle = /** @type {HTMLElement} */ (document.querySelector('.resize-handle'));
  const burgerMenu = /** @type {HTMLElement} */ (document.querySelector('#burgerMenu'));
  
  if (!sidebar || !resizeHandle) return;
  
  let isResizing = false;

  function updateSidebarState(collapsed) {
    sidebar.classList.toggle('collapsed', collapsed);
    if (collapsed && window.innerWidth > 768) sidebar.style.width = '';
    burgerMenu.classList.toggle('active', !collapsed);
  }
  
  if (burgerMenu) {
    burgerMenu.addEventListener('click', () => {
      updateSidebarState(!sidebar.classList.contains('collapsed'));
    });
  }
  
  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    sidebar.style.transition = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  });
  
  function handleMouseMove(e) {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    
    if (newWidth >= 150 && newWidth <= 400) {
      sidebar.style.width = newWidth + 'px';
      updateSidebarState(false);
    } else if (newWidth < 150) {
      updateSidebarState(true);
    }
  }
  
  function handleMouseUp() {
    isResizing = false;
    sidebar.style.transition = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
}