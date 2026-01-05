export default function getButtonNaturalWidth(btn: Element): number {
  const textSpan = btn.querySelector('span');
  if (textSpan === null) return btn.scrollWidth;

  const btnStyles = window.getComputedStyle(btn);
  const paddingLeft = parseFloat(btnStyles.paddingLeft);
  const paddingRight = parseFloat(btnStyles.paddingRight);

  return textSpan.scrollWidth + paddingLeft + paddingRight;
}
