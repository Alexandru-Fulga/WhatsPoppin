import { useState } from 'react'
import { getWatchData, imageUrl, REGIONS } from '../../api/tmdb'
import { ExternalLinkIcon } from '../ui/icons'

const GROUPS = [
  { key: 'flatrate', label: 'Stream' },
  { key: 'free', label: 'Free' },
  { key: 'ads', label: 'Free with ads' },
  { key: 'rent', label: 'Rent' },
  { key: 'buy', label: 'Buy' },
]

export default function WatchProviders({ details }) {
  const [region, setRegion] = useState('US')
  const data = getWatchData(details, region)
  const regionLabel =
    REGIONS.find((item) => item.code === region)?.label ?? region

  const groups = GROUPS.map((group) => ({
    ...group,
    providers: data?.[group.key] ?? [],
  })).filter((group) => group.providers.length > 0)

  return (
    <section className="rounded-2xl border border-border bg-surface p-5.5 shadow-soft">
      <div className="mb-4.5 flex items-center justify-between gap-3.5">
        <h2 className="text-[1.25rem]">Where to watch</h2>
        <label className="relative">
          <span className="sr-only">Choose your region</span>
          <select
            className="cursor-pointer rounded-lg border border-border bg-surface-muted px-2.5 py-1.5 text-[0.82rem] font-medium text-foreground transition-all focus:border-flame focus:ring-3 focus:ring-flame/15 focus:outline-none"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
          >
            {REGIONS.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {groups.length === 0 ? (
        <p className="text-[0.9rem] text-muted">
          No streaming information available for {regionLabel} yet. Try another
          region.
        </p>
      ) : (
        <div className="flex flex-col gap-4.5">
          {groups.map((group) => (
            <div key={group.key}>
              <h3 className="mb-2.5 font-sans text-[0.74rem] font-bold tracking-[0.14em] text-muted uppercase">
                {group.label}
              </h3>
              <ul className="flex flex-wrap gap-3.5">
                {group.providers.map((provider) => (
                  <li
                    key={provider.provider_id}
                    className="group flex w-16.5 flex-col items-center gap-1.5"
                  >
                    <img
                      src={imageUrl(provider.logo_path, 'w92')}
                      alt={provider.provider_name}
                      title={provider.provider_name}
                      loading="lazy"
                      className="size-12 rounded-xl object-cover shadow-soft transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.04] group-hover:shadow-soft"
                    />
                    <span className="text-center text-[0.68rem] leading-[1.3] text-muted">
                      {provider.provider_name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data?.link && (
        <a
          className="mt-5 inline-flex items-center gap-[7px] text-[0.84rem] font-semibold text-flame transition-all duration-300 hover:gap-2.5 hover:text-crimson [&_svg]:size-[15px]"
          href={data.link}
          target="_blank"
          rel="noreferrer"
        >
          Full availability on JustWatch
          <ExternalLinkIcon />
        </a>
      )}
    </section>
  )
}
