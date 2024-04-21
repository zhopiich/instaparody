export const getPosition = (target) => {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const targetHeight = target.offsetHeight;
  const targetFromTop = target.getBoundingClientRect().top;

  const targetFromLeft = target.getBoundingClientRect().left;

  return {
    bottom: viewportHeight - targetFromTop - targetHeight,
    right: viewportWidth - targetFromLeft,
    dimensions: {
      viewportHeight,
      viewportWidth,
      targetHeight,
      targetFromTop,
      targetFromLeft,
    },
  };
};
