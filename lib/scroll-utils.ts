export function smoothScrollTo(elementId: string) {
  const element = document.getElementById(elementId)
  if (element) {
    // Add offset for the sticky header
    const headerOffset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}

