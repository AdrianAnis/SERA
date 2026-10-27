type SocialLoginButtonsProps = {
  onSelect: () => void
}

type SocialProvider = {
  label: string
  viewBox: string
  path: string
}

const SOCIAL_PROVIDERS: SocialProvider[] = [
  {
    label: "Facebook",
    viewBox: "0 0 320 512",
    path: "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z",
  },
  {
    label: "Google",
    viewBox: "0 0 488 512",
    path: "M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z",
  },
  {
    label: "Apple",
    viewBox: "0 0 384 512",
    path: "M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 24 184.5 15.6 232.3c-15.6 86.8 54.8 221.3 93.9 221.3 27.6 0 37-17 71.7-17s45.1 17 71.7 17c37.5 0 92-124 92-124-34.9-18.6-54.8-54.3-54.8-93.5zM224 87.5c15.6-19.7 26.3-46.9 23.5-73.5-23.5 2.8-51.7 17.8-67.2 36.6-15 19.7-27.2 46-24.4 72.6 25.4 0 52.6-15.9 68.1-35.7z",
  },
]

export function SocialLoginButtons({ onSelect }: SocialLoginButtonsProps) {
  return (
    <div className="flex justify-center gap-5">
      {SOCIAL_PROVIDERS.map((provider) => (
        <button
          key={provider.label}
          type="button"
          aria-label={`Lanjut dengan ${provider.label}`}
          onClick={onSelect}
          className="flex size-12 items-center justify-center rounded-full border bg-card text-foreground shadow-md transition-all hover:-translate-y-1 active:scale-95"
        >
          <svg viewBox={provider.viewBox} className="size-5 fill-current" aria-hidden="true">
            <path d={provider.path} />
          </svg>
        </button>
      ))}
    </div>
  )
}
