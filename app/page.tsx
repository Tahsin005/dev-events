import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import events from "@/lib/constants"

const Home = () => {
  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Mustn't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, Conferences, All in one place!</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h1>Featured Events</h1>

        <ul className="events">
                    {events && events.length > 0 && events.map((event) => (
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
