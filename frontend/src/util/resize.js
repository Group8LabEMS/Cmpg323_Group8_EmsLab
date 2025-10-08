// Sidebar resize functionality
export function initSidebarResize() {
  const sidebar =      /** @type {HTMLElement} */ (document.querySelector('.sidebar'));
  const resizeHandle = /** @type {HTMLElement} */ (document.querySelector('.resize-handle'));
  
  if (!sidebar || !resizeHandle) return;
  
  let isResizing = false;
  
  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  });
  
  function handleMouseMove(e) {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    if (newWidth >= 150 && newWidth <= 400) {
      sidebar.style.width = newWidth + 'px';
    }
  }
  
  function handleMouseUp() {
    isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
}