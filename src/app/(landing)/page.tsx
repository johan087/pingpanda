import { DiscordMessage } from "@/components/discord-message";
import { Heading } from "@/components/heading";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { MockDiscordUI } from "@/components/mock-discord-ui";
import { ShinyButton } from "@/components/shiny-button";
import { AnimatedList } from "@/components/ui/animated-list";
import { Check } from "lucide-react";

const Page = () => {
  return (
    <>
      <section className="relative py-24 sm:py-32 bg-blue-50">
        <MaxWidthWrapper className="text-center">
          <div className="relative mx-auto text-center flex flex-col items-center gap-10">
            <div>
              <Heading>
                <span>Real-Time Saas Insights,</span>
                <br />
                <span>Delivered to Your Discord</span>
              </Heading>
            </div>
          </div>
          <p className="mt-12 text-base/7 text-gray-700 max-w-prose text-center text-pretty">
            PingPanda is the easiest way to monitor your Saas. Get instant
            notification for{" "}
            <span className="font-semibold text-gray-700">
              sales, new users, or any other event
            </span>{" "}
            sent directly to your Discord.
          </p>
          <ul className="mt-12 space-y-2 text-base/7 text-gray-600 text-left flex flex-col items-center sm:items-start">
            {[
              "Real-time Discord alerts for critical events",
              "Buy once, use forever",
              "Track sales, new users, or any other event",
            ].map((item, index) => (
              <div key={index}>
                <li className="flex-gap-1.5 flex text-left">
                  <Check className="size-5 shrink-0 text-blue-600" /> {item}
                </li>
              </div>
            ))}
          </ul>
          <ShinyButton
            href="/sign-up"
            className="mt-12 relative z-10 h-14 w-full text-base shadow-lg hover:shadow-xl"
          >
            Start For Free Today{" "}
          </ShinyButton>
        </MaxWidthWrapper>
      </section>
      <section className="relative bg-blue-500 pb-4">
        <div className="absolute inset-x-0 bottom-24 top-24 bg-blue-700" />
        <div className="relative mx-auto">
          <MaxWidthWrapper className="relative">
            <div className="-m-2 rounded-xl bg-gray-900/50 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:px-4">
              <MockDiscordUI>
                <AnimatedList>
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="PingPanda Avatar"
                    timestamp="Today at 12:35pm"
                    title="🧑‍🦱 New user signed up"
                    username="PingPanda"
                    content={{
                      name: "Mateo Oritz",
                      email: "m.ortiz19@gmail.com",
                    }}
                    badgeText="SignUp"
                    badgeColor="#43b581"
                  />
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="PingPanda Avatar"
                    timestamp="Today at 12:35pm"
                    title="💰 Payment received"
                    username="PingPanda"
                    content={{
                      amount: "$49.00",
                      email: "johan087@gmail.com",
                      plan: "PRO",
                    }}
                    badgeText="Revenue"
                    badgeColor="#faa61a"
                  />
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="PingPanda Avatar"
                    timestamp="Today at 05:35pm"
                    title="🚀 Revenue Milestone Achieved"
                    username="PingPanda"
                    content={{
                      recuringRevenue: "$5.000 USD",
                      growth: "+8.2%",
                    }}
                    badgeText="Milestone"
                    badgeColor="#5865f2"
                  />
                </AnimatedList>
              </MockDiscordUI>
            </div>
          </MaxWidthWrapper>
        </div>
      </section>
      <section></section>
      <section></section>
    </>
  );
};

export default Page;
