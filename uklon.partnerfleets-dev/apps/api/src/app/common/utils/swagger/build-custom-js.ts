export const buildCustomJs = (): string => {
  return `
    let collapseBtn = null;

    setInterval(() => {
      const elements = document.querySelectorAll('.opblock-summary-description')
      elements.forEach((element) => {
        if (element.style.display !== 'block' && element.innerText) {
          element.innerHTML = element.innerText;
          element.style.display = 'block';
        }
      });

      if (!collapseBtn) {
        const authWrapper = document.querySelector('.schemes.wrapper .auth-wrapper');
        if (authWrapper) {
          collapseBtn = document.createElement('BUTTON');
          collapseBtn.innerText = 'Collapse sections';
          collapseBtn.classList.add('btn', 'uklon-collapse-btn');
          collapseBtn.onclick = () => {
            const sections = document.querySelectorAll('.opblock-tag.no-desc[data-is-open=true]');
            sections.forEach((element) => {
              element.click()
            });
          };
          authWrapper.insertBefore(collapseBtn, authWrapper.firstChild);
        }
      }
    }, 1000);
  `;
};
