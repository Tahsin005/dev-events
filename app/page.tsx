import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const getEvents = async () => {
  const baseUrl = BASE_URL ? BASE_URL.replace(/\/$/, '') : '';

  try {
    const response = await fetch(`${baseUrl}/api/events`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json().catch(() => null);

    if (!data || !Array.isArray(data.events)) {
      return [];
    }

    return data.events;
  } catch {
    return [];
  }
}

const Home = async () => {
  'use cache';
  cacheLife('hours')
  const events = await getEvents();

  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Mustn't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, Conferences, All in one place!</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h1>Featured Events</h1>

        <ul className="events">
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Home
