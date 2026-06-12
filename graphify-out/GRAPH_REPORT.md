# Graph Report - c:/Users/Gauravv/Downloads/Maisone  (2026-06-12)

## Corpus Check
- 104 files · ~112,099 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 571 nodes · 735 edges · 55 communities (42 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Sidebar & Shell UI Components|Sidebar & Shell UI Components]]
- [[_COMMUNITY_Developer Configuration & Linter|Developer Configuration & Linter]]
- [[_COMMUNITY_Common Navigation & Layout|Common Navigation & Layout]]
- [[_COMMUNITY_App Routing & Entry Points|App Routing & Entry Points]]
- [[_COMMUNITY_Landing Page Feature Sections|Landing Page Feature Sections]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Shadcn Components Configuration|Shadcn Components Configuration]]
- [[_COMMUNITY_Form Input & Utility Components|Form Input & Utility Components]]
- [[_COMMUNITY_Menubar UI Components|Menubar UI Components]]
- [[_COMMUNITY_Dialog & Alert Components|Dialog & Alert Components]]
- [[_COMMUNITY_Dialog & Alert Components|Dialog & Alert Components]]
- [[_COMMUNITY_Subsystem 12|Subsystem 12]]
- [[_COMMUNITY_Subsystem 13|Subsystem 13]]
- [[_COMMUNITY_Subsystem 14|Subsystem 14]]
- [[_COMMUNITY_Subsystem 15|Subsystem 15]]
- [[_COMMUNITY_Error Capture & Handling|Error Capture & Handling]]
- [[_COMMUNITY_Subsystem 17|Subsystem 17]]
- [[_COMMUNITY_Subsystem 18|Subsystem 18]]
- [[_COMMUNITY_Subsystem 19|Subsystem 19]]
- [[_COMMUNITY_Dropdown & Context Menus|Dropdown & Context Menus]]
- [[_COMMUNITY_Subsystem 21|Subsystem 21]]
- [[_COMMUNITY_Subsystem 22|Subsystem 22]]
- [[_COMMUNITY_Subsystem 23|Subsystem 23]]
- [[_COMMUNITY_Subsystem 24|Subsystem 24]]
- [[_COMMUNITY_Subsystem 25|Subsystem 25]]
- [[_COMMUNITY_Subsystem 26|Subsystem 26]]
- [[_COMMUNITY_Subsystem 27|Subsystem 27]]
- [[_COMMUNITY_Card & Carousel UI Components|Card & Carousel UI Components]]
- [[_COMMUNITY_Subsystem 29|Subsystem 29]]
- [[_COMMUNITY_Subsystem 30|Subsystem 30]]
- [[_COMMUNITY_Subsystem 31|Subsystem 31]]
- [[_COMMUNITY_Subsystem 32|Subsystem 32]]
- [[_COMMUNITY_Subsystem 33|Subsystem 33]]
- [[_COMMUNITY_Subsystem 34|Subsystem 34]]
- [[_COMMUNITY_Subsystem 35|Subsystem 35]]
- [[_COMMUNITY_Subsystem 36|Subsystem 36]]
- [[_COMMUNITY_Accordion UI Components|Accordion UI Components]]
- [[_COMMUNITY_Subsystem 38|Subsystem 38]]
- [[_COMMUNITY_Subsystem 39|Subsystem 39]]
- [[_COMMUNITY_Card & Carousel UI Components|Card & Carousel UI Components]]
- [[_COMMUNITY_Subsystem 41|Subsystem 41]]
- [[_COMMUNITY_Subsystem 42|Subsystem 42]]
- [[_COMMUNITY_Subsystem 43|Subsystem 43]]
- [[_COMMUNITY_Subsystem 44|Subsystem 44]]
- [[_COMMUNITY_Card & Carousel UI Components|Card & Carousel UI Components]]
- [[_COMMUNITY_Subsystem 46|Subsystem 46]]
- [[_COMMUNITY_Subsystem 47|Subsystem 47]]
- [[_COMMUNITY_Subsystem 48|Subsystem 48]]
- [[_COMMUNITY_Subsystem 49|Subsystem 49]]
- [[_COMMUNITY_Subsystem 50|Subsystem 50]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 69 edges
2. `compilerOptions` - 17 edges
3. `scripts` - 7 edges
4. `aliases` - 6 edges
5. `Logo()` - 6 edges
6. `buttonVariants` - 6 edges
7. `tailwind` - 5 edges
8. `normalizeCatastrophicSsrResponse()` - 5 edges
9. `useTheme()` - 5 edges
10. `FileRoutesByPath` - 4 edges

## Surprising Connections (you probably didn't know these)
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `BreadcrumbSeparator()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `CalendarDayButton()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/calendar.tsx → src/lib/utils.ts

## Communities (55 total, 13 thin omitted)

### Community 0 - "Package Dependencies"
Cohesion: 0.04
Nodes (55): dependencies, class-variance-authority, @cloudflare/vite-plugin, clsx, cmdk, date-fns, embla-carousel-react, framer-motion (+47 more)

### Community 1 - "Sidebar & Shell UI Components"
Cohesion: 0.05
Nodes (38): useIsMobile(), Input, Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader() (+30 more)

### Community 2 - "Developer Configuration & Linter"
Cohesion: 0.07
Nodes (28): devDependencies, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+20 more)

### Community 3 - "Common Navigation & Layout"
Cohesion: 0.14
Nodes (12): Theme, ThemeContext, ThemeProvider(), useTheme(), Footer(), offices, Loader(), Logo() (+4 more)

### Community 4 - "App Routing & Entry Points"
Cohesion: 0.13
Nodes (15): Route, Route, Route, getRouter(), BookDemoRoute, FileRoutesByFullPath, FileRoutesById, FileRoutesByPath (+7 more)

### Community 5 - "Landing Page Feature Sections"
Cohesion: 0.13
Nodes (12): Automation(), nodes, features, founders, HowWeWork(), phases, Marketplace(), PRODUCTS (+4 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 7 - "Shadcn Components Configuration"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 8 - "Form Input & Utility Components"
Cohesion: 0.11
Nodes (10): Checkbox, HoverCardContent, PopoverContent, Progress, Slider, Switch, TabsContent, TabsList (+2 more)

### Community 9 - "Menubar UI Components"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 10 - "Dialog & Alert Components"
Cohesion: 0.12
Nodes (14): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut() (+6 more)

### Community 11 - "Dialog & Alert Components"
Cohesion: 0.16
Nodes (13): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+5 more)

### Community 12 - "Subsystem 12"
Cohesion: 0.12
Nodes (13): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+5 more)

### Community 13 - "Subsystem 13"
Cohesion: 0.21
Nodes (12): cn(), Pagination(), PaginationContent, PaginationEllipsis(), PaginationItem, PaginationLink(), PaginationLinkProps, PaginationNext() (+4 more)

### Community 14 - "Subsystem 14"
Cohesion: 0.14
Nodes (11): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+3 more)

### Community 15 - "Subsystem 15"
Cohesion: 0.14
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 16 - "Error Capture & Handling"
Cohesion: 0.25
Nodes (9): consumeLastCapturedError(), renderErrorPage(), brandedErrorResponse(), fetch(), getServerEntry(), isCatastrophicSsrErrorBody(), normalizeCatastrophicSsrResponse(), ServerEntry (+1 more)

### Community 17 - "Subsystem 17"
Cohesion: 0.17
Nodes (6): Dashboard(), NAV, SHIPMENTS, SUPPLIERS, trend, View

### Community 18 - "Subsystem 18"
Cohesion: 0.21
Nodes (6): GlobalPresence(), Hero(), HUBS, SourcingNetwork(), HUBS, WorldMap()

### Community 19 - "Subsystem 19"
Cohesion: 0.18
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 20 - "Dropdown & Context Menus"
Cohesion: 0.20
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 21 - "Subsystem 21"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 22 - "Subsystem 22"
Cohesion: 0.25
Nodes (5): CAPACITY, CERTS, CLIENTS, MONTHS, SupplierProfile()

### Community 23 - "Subsystem 23"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 24 - "Subsystem 24"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 25 - "Subsystem 25"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 26 - "Subsystem 26"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 27 - "Subsystem 27"
Cohesion: 0.29
Nodes (5): DATA, Forecast, Region, REGIONS, TrendForecast()

### Community 28 - "Card & Carousel UI Components"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 29 - "Subsystem 29"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 30 - "Subsystem 30"
Cohesion: 0.40
Nodes (4): AIAssistant(), Bubble, PROMPTS, Supplier

### Community 31 - "Subsystem 31"
Cohesion: 0.40
Nodes (3): Analytics(), series, series2

### Community 33 - "Subsystem 33"
Cohesion: 0.40
Nodes (4): COMPLIANCE, INVESTORS, PRESS, TrustStrip()

### Community 34 - "Subsystem 34"
Cohesion: 0.40
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 35 - "Subsystem 35"
Cohesion: 0.50
Nodes (3): CaseStudies(), STUDIES, Study

### Community 36 - "Subsystem 36"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 37 - "Accordion UI Components"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 38 - "Subsystem 38"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeVariants

## Knowledge Gaps
- **340 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `css` (+335 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Subsystem 13` to `Sidebar & Shell UI Components`, `Form Input & Utility Components`, `Menubar UI Components`, `Dialog & Alert Components`, `Dialog & Alert Components`, `Subsystem 12`, `Subsystem 14`, `Subsystem 15`, `Subsystem 19`, `Dropdown & Context Menus`, `Subsystem 21`, `Subsystem 23`, `Subsystem 24`, `Subsystem 25`, `Subsystem 26`, `Card & Carousel UI Components`, `Subsystem 29`, `Subsystem 34`, `Subsystem 36`, `Accordion UI Components`, `Subsystem 38`, `Subsystem 49`, `Subsystem 50`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies` to `Developer Configuration & Linter`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _340 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03636363636363636 - nodes in this community are weakly interconnected._
- **Should `Sidebar & Shell UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.052525252525252523 - nodes in this community are weakly interconnected._
- **Should `Developer Configuration & Linter` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Common Navigation & Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.13852813852813853 - nodes in this community are weakly interconnected._