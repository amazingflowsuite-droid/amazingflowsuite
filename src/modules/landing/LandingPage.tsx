import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    Clock,
    Layout,
    CalendarDays,
    Target,
    BarChart3,
    Terminal,
    CheckCircle2,
    Zap,
    ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
                    <div className="flex items-center gap-2">
                        {/* Logo Icon */}
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                            <Zap className="h-5 w-5 fill-current" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">Amazing Flow</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
                        <div className="relative group cursor-pointer flex items-center gap-1 hover:text-emerald-600 transition-colors">
                            <span>Product</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                        <Link to="/pricing" className="hover:text-emerald-600 transition-colors">Pricing</Link>
                        <Link to="/resources" className="hover:text-emerald-600 transition-colors">Resources</Link>
                        <div className="relative group cursor-pointer flex items-center gap-1 hover:text-emerald-600 transition-colors">
                            <span>Contact</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">Log in</Link>
                        <Button asChild className="rounded-full px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-200/50 transition-all hover:scale-105">
                            <Link to="/signup">Sign Up</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-16 pb-20 lg:pt-32 lg:pb-28">
                    {/* Background Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-[#2EBD85]/10 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
                        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
                    </div>

                    <div className="container mx-auto px-6 max-w-7xl relative">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                            {/* Hero Text */}
                            <div className="text-center lg:text-left pt-8 lg:pt-0 animate-in slide-in-from-left duration-1000 delay-200">
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
                                    Unleash your <br />
                                    team's <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2EBD85] to-[#34D399]">true potential</span>.
                                </h1>

                                <p className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                                    Streamline your agile workflow with the ultimate suite of tools for daily standups, kanban boards, and team analytics.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                    <Button asChild size="lg" className="rounded-full px-8 h-14 bg-[#2EBD85] hover:bg-[#25a06e] text-white font-semibold text-lg shadow-lg shadow-emerald-200/50 transition-all hover:scale-105">
                                        <Link to="/daily">Get Started</Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 border-gray-300 text-gray-700 font-semibold text-lg hover:bg-gray-50 hover:text-gray-900 transition-all">
                                        <Link to="/pricing">View Pricing</Link>
                                    </Button>
                                </div>

                                <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-[#2EBD85]" />
                                        <span>No credit card required</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-[#2EBD85]" />
                                        <span>14-day free trial</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div className="relative animate-in slide-in-from-right duration-1000 delay-200">
                                <div className="absolute -inset-4 bg-gradient-to-r from-[#2EBD85]/20 to-blue-500/20 rounded-full blur-3xl -z-10"></div>
                                <img
                                    src="/src/modules/landing/hero_premium_variant.png"
                                    alt="Amazing Flow Dashboard 3D"
                                    className="relative w-full h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section id="features" className="py-20 bg-gray-50/50">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">The Amazing Suite</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to build high-performing teams, from daily syncs to deep analytics.</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                            {/* Amazing Daily */}
                            <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-3xl overflow-hidden group">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-3 w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 px-3 py-1 rounded-full">Launch App</Badge>
                                    </div>
                                    <CardTitle className="text-2xl text-gray-900 mt-4">Amazing Daily</CardTitle>
                                    <CardDescription className="text-sm text-gray-500 mt-2 leading-relaxed">
                                        Streamline your daily standups. Keep meetings focused, on time, and automatically generate reports.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid gap-2 text-sm text-gray-600">
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Smart timer & rotation</li>
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Automated summaries</li>
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Team mood tracking</li>
                                    </ul>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button asChild className="w-full h-12 rounded-xl text-white bg-gray-900 hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <Link to="/daily">Open Daily</Link>
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Amazing Kanban */}
                            <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-3xl overflow-hidden group">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-3 w-12 h-12 rounded-xl bg-blue-400 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                                            <Layout className="h-6 w-6" />
                                        </div>
                                        <Badge className="bg-blue-400 hover:bg-blue-500 text-white border-0 px-3 py-1 rounded-full">Launch App</Badge>
                                    </div>
                                    <CardTitle className="text-2xl text-gray-900 mt-4">Amazing Kanban</CardTitle>
                                    <CardDescription className="text-sm text-gray-500 mt-2 leading-relaxed">
                                        Visualize your workflow with a flexible board. Manage tasks, sprints, and drag-and-drop with ease.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid gap-2 text-sm text-gray-600">
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Drag-and-drop interface</li>
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Customizable columns</li>
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> WIP limits & tags</li>
                                    </ul>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button asChild className="w-full h-12 rounded-xl text-white bg-gray-900 hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <Link to="/kanban">Open Kanban</Link>
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Amazing Planning */}
                            <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-3xl overflow-hidden group">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-3 w-12 h-12 rounded-xl bg-purple-400 text-white flex items-center justify-center shadow-lg shadow-purple-200">
                                            <CalendarDays className="h-6 w-6" />
                                        </div>
                                        <Badge className="bg-purple-400 hover:bg-purple-500 text-white border-0 px-3 py-1 rounded-full">Launch App</Badge>
                                    </div>
                                    <CardTitle className="text-2xl text-gray-900 mt-4">Amazing Planning</CardTitle>
                                    <CardDescription className="text-sm text-gray-500 mt-2 leading-relaxed">
                                        Master your timeline. Plan sprints, allocate resources, and forecast delivery with confidence.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid gap-2 text-sm text-gray-600">
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Sprint capacity planning</li>
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Resource allocation</li>
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Delivery forecasting</li>
                                    </ul>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button asChild className="w-full h-12 rounded-xl text-white bg-gray-900 hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <Link to="/planning">Open Planning</Link>
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Amazing Retro */}
                            <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-3xl overflow-hidden group opacity-90 hover:opacity-100">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-3 w-12 h-12 rounded-xl bg-orange-400 text-white flex items-center justify-center shadow-lg shadow-orange-200">
                                            <Target className="h-6 w-6" />
                                        </div>
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Coming Soon</Badge>
                                    </div>
                                    <CardTitle className="text-2xl text-gray-900 mt-4">Amazing Retro</CardTitle>
                                    <CardDescription className="text-sm text-gray-500 mt-2 leading-relaxed">
                                        Run meaningful retrospectives. Capture insights, vote on action items, and drive improvement.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid gap-2 text-sm text-gray-600">
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-orange-400 mr-2" /> Actionable items</li>
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-orange-400 mr-2" /> Voting system</li>
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-orange-400 mr-2" /> AI-driven summaries</li>
                                    </ul>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button asChild className="w-full h-12 rounded-xl text-white bg-gray-900 hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <Link to="/retro">Open Retro</Link>
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Amazing Metrics */}
                            <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-3xl overflow-hidden group">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-3 w-12 h-12 rounded-xl bg-indigo-400 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                            <BarChart3 className="h-6 w-6" />
                                        </div>
                                        <Badge className="bg-indigo-400 hover:bg-indigo-500 text-white border-0 px-3 py-1 rounded-full">Launch App</Badge>
                                    </div>
                                    <CardTitle className="text-2xl text-gray-900 mt-4">Amazing Metrics</CardTitle>
                                    <CardDescription className="text-sm text-gray-500 mt-2 leading-relaxed">
                                        Advanced analytics to understand velocity and flow. Data-driven insights for your team.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid gap-2 text-sm text-gray-600">
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2" /> Cycle time analysis</li>
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2" /> Burndown charts</li>
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2" /> Value stream mapping</li>
                                    </ul>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button asChild className="w-full h-12 rounded-xl text-white bg-gray-900 hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <Link to="/metrics">Open Metrics</Link>
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Amazing Learning */}
                            <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-3xl overflow-hidden group">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-3 w-12 h-12 rounded-xl bg-pink-400 text-white flex items-center justify-center shadow-lg shadow-pink-200">
                                            <Terminal className="h-6 w-6" />
                                        </div>
                                        <Badge className="bg-pink-400 hover:bg-pink-500 text-white border-0 px-3 py-1 rounded-full">Launch App</Badge>
                                    </div>
                                    <CardTitle className="text-2xl text-gray-900 mt-4">Amazing Learning</CardTitle>
                                    <CardDescription className="text-sm text-gray-500 mt-2 leading-relaxed">
                                        Integrated learning modules. Helps your team adopt and master agile best practices.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid gap-2 text-sm text-gray-600">
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-pink-400 mr-2" /> Agile paths</li>
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-pink-400 mr-2" /> Role-based guides</li>
                                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-pink-400 mr-2" /> Interactive workshops</li>
                                    </ul>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button asChild className="w-full h-12 rounded-xl text-white bg-gray-900 hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <Link to="/learning">Open Learning</Link>
                                    </Button>
                                </CardFooter>
                            </Card>

                        </div>
                    </div>
                </section>

                {/* Dashboard Previews */}
                <section className="py-24 bg-gray-50/80 border-t border-gray-100">
                    <div className="container mx-auto px-6 max-w-7xl space-y-24">

                        {/* Amazing Metrics Feature Block */}
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2 text-left animate-in slide-in-from-left duration-700 delay-200">
                                <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-0 px-4 py-1.5 rounded-full text-sm font-medium">Deep Insights</Badge>
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                    Visualize your progress with <br />
                                    <span className="text-indigo-600">Amazing Metrics</span>
                                </h2>
                                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                    Gain actionable insights with our comprehensive dashboard. Track velocity, burn-down charts, and individual contributions in real-time to make data-driven decisions that propel your team forward.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center text-gray-700 font-medium">
                                        <div className="mr-3 p-1 rounded-full bg-indigo-100 text-indigo-600"><CheckCircle2 className="w-4 h-4" /></div>
                                        Real-time velocity tracking
                                    </li>
                                    <li className="flex items-center text-gray-700 font-medium">
                                        <div className="mr-3 p-1 rounded-full bg-indigo-100 text-indigo-600"><CheckCircle2 className="w-4 h-4" /></div>
                                        Contribution heatmaps
                                    </li>
                                </ul>
                                <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-2 border-indigo-100 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-200 transaction-all">
                                    <Link to="/metrics">Explore Metrics</Link>
                                </Button>
                            </div>
                            <div className="lg:w-1/2 relative group animate-in slide-in-from-right duration-700 delay-300">
                                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                                <img
                                    src="/assets/dashboard_metrics.png"
                                    alt="Analytics Dashboard Interface"
                                    className="relative w-full rounded-2xl shadow-2xl border border-gray-100/50 transform transition hover:scale-[1.02] duration-500"
                                />
                            </div>
                        </div>

                        {/* Amazing Kanban Feature Block */}
                        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                            <div className="lg:w-1/2 text-left lg:text-right animate-in slide-in-from-right duration-700 delay-200">
                                <div className="flex justify-start lg:justify-end">
                                    <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-0 px-4 py-1.5 rounded-full text-sm font-medium">Seamless Workflow</Badge>
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                    Streamline workflow with <br />
                                    <span className="text-blue-500">Amazing Kanban</span>
                                </h2>
                                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                    A flexible board that adapts to your team's style. Move cards effortlessly, assign tasks, set due dates, and visualize your entire project pipeline at a single glance.
                                </p>
                                <ul className="space-y-3 mb-8 flex flex-col lg:items-end">
                                    <li className="flex items-center text-gray-700 font-medium">
                                        <div className="lg:hidden mr-3 p-1 rounded-full bg-blue-100 text-blue-600"><CheckCircle2 className="w-4 h-4" /></div>
                                        Drag & drop interface
                                        <div className="hidden lg:block ml-3 p-1 rounded-full bg-blue-100 text-blue-600"><CheckCircle2 className="w-4 h-4" /></div>
                                    </li>
                                    <li className="flex items-center text-gray-700 font-medium">
                                        <div className="lg:hidden mr-3 p-1 rounded-full bg-blue-100 text-blue-600"><CheckCircle2 className="w-4 h-4" /></div>
                                        Custom workflows
                                        <div className="hidden lg:block ml-3 p-1 rounded-full bg-blue-100 text-blue-600"><CheckCircle2 className="w-4 h-4" /></div>
                                    </li>
                                </ul>
                                <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-2 border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transaction-all">
                                    <Link to="/kanban">Try Kanban Board</Link>
                                </Button>
                            </div>
                            <div className="lg:w-1/2 relative group animate-in slide-in-from-left duration-700 delay-300">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                                <img
                                    src="/assets/dashboard_kanban.png"
                                    alt="Kanban Board Interface"
                                    className="relative w-full rounded-2xl shadow-2xl border border-gray-100/50 transform transition hover:scale-[1.02] duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="py-20">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="bg-emerald-600 rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
                            {/* Decorative circles */}
                            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500 rounded-full opacity-50 blur-3xl"></div>
                            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-emerald-400 rounded-full opacity-50 blur-3xl"></div>

                            <h2 className="relative z-10 text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                                Ready to optimize your flow? <br />
                                Start using Amazing Daily today.
                            </h2>
                            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button asChild size="lg" className="h-14 px-8 rounded-full text-emerald-600 bg-white hover:bg-gray-50 font-semibold shadow-lg transition-transform hover:scale-105">
                                    <Link to="/daily">Get Started for Free</Link>
                                </Button>
                                <Button size="lg" variant="ghost" className="h-14 px-8 rounded-full text-white hover:bg-emerald-500/50 font-semibold border-2 border-emerald-400/30 hover:border-emerald-400/50 transition-all">
                                    Contact Sales
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="container mx-auto px-6 max-w-7xl flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                            <Zap className="h-5 w-5 fill-current" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">Amazing Flow</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 mb-8">
                        <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">Cookie Policy</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">Support</a>
                    </div>
                    <p className="text-sm text-gray-400">
                        © 2024 Amazing Flow Inc. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};
