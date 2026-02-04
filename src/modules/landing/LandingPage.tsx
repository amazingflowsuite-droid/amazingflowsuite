import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    Zap,
    Layout,
    Target,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Clock,
    Terminal,
    BarChart3,
    CalendarDays
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/10 selection:text-primary">

            {/* Navigation */}
            <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="flex h-16 items-center px-6 max-w-7xl mx-auto justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Zap className="h-5 w-5 fill-current" />
                        </div>
                        Amazing Flow
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost">Sign In</Button>
                        <Button>Get Started</Button>
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
                    <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto px-4">
                        <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium">
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            The Tailored Agile Suite
                        </Badge>

                        <h1 className="font-heading text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl tracking-tight">
                            Unleash your team's <br />
                            <span className="text-primary">true potential.</span>
                        </h1>

                        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                            Stop managing chaos. Start designing flow. A modular ecosystem built for high-performance engineering teams who value focus over process.
                        </p>

                        <div className="space-x-4">
                            <Button size="lg" asChild className="h-12 px-8 rounded-full text-base">
                                <Link to="/daily">
                                    Launch Daily <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-base">
                                View Pricing
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section id="features" className="container space-y-6 py-8 md:py-12 lg:py-24 max-w-7xl mx-auto px-6">
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold tracking-tight">
                            The Amazing Suite
                        </h2>
                        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                            Everything you need to plan, execute, and improve. Integrated seamlessly into one unified platform.
                        </p>
                    </div>

                    <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-8">

                        {/* Amazing Daily */}
                        <Card className="flex flex-col border-border shadow-sm hover:shadow-lg transition-all hover:border-primary/50 group">
                            <CardHeader>
                                <div className="p-2 w-fit rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl">Amazing Daily</CardTitle>
                                <CardDescription className="text-base">
                                    Master your stand-ups. Automated timers, rotations, and audio cues.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="grid gap-3 text-sm text-muted-foreground">
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Smart Timer Constraints</li>
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Auto-Queue & Rotation</li>
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Audio Feedback</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link to="/daily">Launch App</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Amazing Kanban */}
                        <Card className="flex flex-col border-border/50 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                            <CardHeader>
                                <div className="p-2 w-fit rounded-lg bg-muted text-muted-foreground mb-4">
                                    <Layout className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl">Amazing Kanban</CardTitle>
                                <CardDescription className="text-base">
                                    Visualize your value stream. Not just tasks, but pure flow efficiency.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="grid gap-3 text-sm text-muted-foreground">
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> WIP Limits that work</li>
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> Cycle Time Analytics</li>
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> Blocker Highlighting</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link to="/kanban">Launch App</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Amazing Planning */}
                        <Card className="flex flex-col border-border/50 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                            <CardHeader>
                                <div className="p-2 w-fit rounded-lg bg-muted text-muted-foreground mb-4">
                                    <CalendarDays className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl">Amazing Planning</CardTitle>
                                <CardDescription className="text-base">
                                    Sprint planning & capacity management based on real team data.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="grid gap-3 text-sm text-muted-foreground">
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> Capacity Calculator</li>
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> Backlog Forecasting</li>
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> Velocity Tracking</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button disabled variant="outline" className="w-full">Coming Soon</Button>
                            </CardFooter>
                        </Card>

                        {/* Amazing Retro */}
                        <Card className="flex flex-col border-border/50 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                            <CardHeader>
                                <div className="p-2 w-fit rounded-lg bg-muted text-muted-foreground mb-4">
                                    <Target className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl">Amazing Retro</CardTitle>
                                <CardDescription className="text-base">
                                    Turn feedback into actionable insights. Facilitate better ritos.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="grid gap-3 text-sm text-muted-foreground">
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> Anonymous Voting</li>
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> AI Sentiment Analysis</li>
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> Action Tracking</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button disabled variant="outline" className="w-full">Coming Soon</Button>
                            </CardFooter>
                        </Card>

                        {/* Amazing Metrics */}
                        <Card className="flex flex-col border-border/50 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                            <CardHeader>
                                <div className="p-2 w-fit rounded-lg bg-muted text-muted-foreground mb-4">
                                    <BarChart3 className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl">Amazing Metrics</CardTitle>
                                <CardDescription className="text-base">
                                    Cross-platform analytics. See the health of your entire ecosystem.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="grid gap-3 text-sm text-muted-foreground">
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> DORA Metrics</li>
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> Flow Efficiency</li>
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> Team Health Check</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button disabled variant="outline" className="w-full">Coming Soon</Button>
                            </CardFooter>
                        </Card>

                        {/* Amazing Learning */}
                        <Card className="flex flex-col border-border/50 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                            <CardHeader>
                                <div className="p-2 w-fit rounded-lg bg-muted text-muted-foreground mb-4">
                                    <Terminal className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl">Amazing Learning</CardTitle>
                                <CardDescription className="text-base">
                                    Gamified certification prep. Study smarter with simulated exams.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="grid gap-3 text-sm text-muted-foreground">
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> Exam Simulations</li>
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> Spaced Repetition</li>
                                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" /> Progress Streaks</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button disabled variant="outline" className="w-full">Coming Soon</Button>
                            </CardFooter>
                        </Card>

                    </div>
                </section>

                {/* CTA Section */}
                <section className="container py-8 md:py-12 lg:py-24 max-w-5xl mx-auto px-6">
                    <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 shadow-2xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                        <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-24 lg:text-left">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Ready to optimize your flow? <br />
                                Start using Amazing Daily today.
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-primary-foreground/80">
                                Join thousands of developers who are reclaiming their time and focus.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                                <Button size="lg" variant="secondary" asChild className="rounded-full px-8 text-base font-semibold">
                                    <Link to="/daily">Get Started</Link>
                                </Button>
                                <Button size="lg" variant="link" className="text-white hover:text-white/80">
                                    Learn more <span aria-hidden="true">→</span>
                                </Button>
                            </div>
                        </div>
                        {/* Decorative Image/Pattern could go here */}
                        <div className="relative mt-16 h-80 lg:mt-8 flex items-center justify-center opacity-30 mix-blend-overlay">
                            <Terminal className="h-full w-full" />
                        </div>
                    </div>
                </section>

            </main>

            <footer className="border-t border-border py-8 md:py-8 bg-muted/30">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by <span className="font-medium underline underline-offset-4">Amazing Flow Inc</span>.
                        The source code is available on <span className="font-medium underline underline-offset-4">GitHub</span>.
                    </p>
                </div>
            </footer>
        </div>
    );
};
