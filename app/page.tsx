"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Home, Edit2, Check, X, ShoppingCart } from "lucide-react"

interface Task {
  id: string
  text: string
  completed: boolean
  room: string
}

interface ShoppingItem {
  id: string
  text: string
  completed: boolean
  room: string // changed from category to room
  quantity?: string
}

const ROOMS = [
  "Soverom oppe",
  "Soverom nede",
  "Bad oppe",
  "Bad nede",
  "Stue",
  "Gang",
  "Kjøkken",
  "Vinrom",
  "Garasje",
  "Uteområde",
  "Inngangsparti",
  "Leilighet",
  "Selma sitt rom",
  "Badstu og tørkerom",
]

export default function HusGjøreliste() {
  const [activeTab, setActiveTab] = useState<"tasks" | "shopping">("tasks")

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0])
  const [filterRoom, setFilterRoom] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [editingRoom, setEditingRoom] = useState("")

  // Shopping state - updated variable names from category to room
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([])
  const [newShoppingItem, setNewShoppingItem] = useState("")
  const [newQuantity, setNewQuantity] = useState("")
  const [selectedShoppingRoom, setSelectedShoppingRoom] = useState(ROOMS[0]) // renamed from selectedCategory
  const [filterShoppingRoom, setFilterShoppingRoom] = useState<string | null>(null) // renamed from filterCategory
  const [editingShoppingItem, setEditingShoppingItem] = useState<string | null>(null)
  const [editingShoppingText, setEditingShoppingText] = useState("")
  const [editingShoppingQuantity, setEditingShoppingQuantity] = useState("")
  const [editingShoppingRoom, setEditingShoppingRoom] = useState("") // renamed from editingShoppingCategory

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("hus-gjøreliste-tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    const savedShoppingItems = localStorage.getItem("hus-gjøreliste-shopping")
    if (savedShoppingItems) {
      setShoppingItems(JSON.parse(savedShoppingItems))
    }
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("hus-gjøreliste-tasks", JSON.stringify(tasks))
  }, [tasks])

  // Save shopping items to localStorage
  useEffect(() => {
    localStorage.setItem("hus-gjøreliste-shopping", JSON.stringify(shoppingItems))
  }, [shoppingItems])

  // Task functions
  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        room: selectedRoom,
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const startEditing = (task: Task) => {
    setEditingTask(task.id)
    setEditingText(task.text)
    setEditingRoom(task.room)
  }

  const saveEdit = () => {
    if (editingTask && editingText.trim()) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask ? { ...task, text: editingText.trim(), room: editingRoom } : task,
        ),
      )
      cancelEdit()
    }
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setEditingText("")
    setEditingRoom("")
  }

  // Shopping functions - updated to use room instead of category
  const addShoppingItem = () => {
    if (newShoppingItem.trim()) {
      const item: ShoppingItem = {
        id: Date.now().toString(),
        text: newShoppingItem.trim(),
        completed: false,
        room: selectedShoppingRoom, // changed from category to room
        quantity: newQuantity.trim() || undefined,
      }
      setShoppingItems([...shoppingItems, item])
      setNewShoppingItem("")
      setNewQuantity("")
    }
  }

  const toggleShoppingItem = (id: string) => {
    setShoppingItems(shoppingItems.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const deleteShoppingItem = (id: string) => {
    setShoppingItems(shoppingItems.filter((item) => item.id !== id))
  }

  const startEditingShopping = (item: ShoppingItem) => {
    setEditingShoppingItem(item.id)
    setEditingShoppingText(item.text)
    setEditingShoppingQuantity(item.quantity || "")
    setEditingShoppingRoom(item.room) // changed from category to room
  }

  const saveShoppingEdit = () => {
    if (editingShoppingItem && editingShoppingText.trim()) {
      setShoppingItems(
        shoppingItems.map((item) =>
          item.id === editingShoppingItem
            ? {
                ...item,
                text: editingShoppingText.trim(),
                quantity: editingShoppingQuantity.trim() || undefined,
                room: editingShoppingRoom, // changed from category to room
              }
            : item,
        ),
      )
      cancelShoppingEdit()
    }
  }

  const cancelShoppingEdit = () => {
    setEditingShoppingItem(null)
    setEditingShoppingText("")
    setEditingShoppingQuantity("")
    setEditingShoppingRoom("") // changed from category to room
  }

  // Filtered data - updated shopping filter to use room
  const filteredTasks = filterRoom ? tasks.filter((task) => task.room === filterRoom) : tasks
  const filteredShoppingItems = filterShoppingRoom
    ? shoppingItems.filter((item) => item.room === filterShoppingRoom) // changed from category to room
    : shoppingItems

  const completedTaskCount = filteredTasks.filter((task) => task.completed).length
  const totalTaskCount = filteredTasks.length

  const completedShoppingCount = filteredShoppingItems.filter((item) => item.completed).length
  const totalShoppingCount = filteredShoppingItems.length

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Home className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Hus & Handel</h1>
          </div>
          <p className="text-muted-foreground">Organiser husoppgaver og innkjøp</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button
                variant={activeTab === "tasks" ? "default" : "outline"}
                onClick={() => setActiveTab("tasks")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Husoppgaver
              </Button>
              <Button
                variant={activeTab === "shopping" ? "default" : "outline"}
                onClick={() => setActiveTab("shopping")}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Innkjøpsliste
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <>
            {/* Add Task Section */}
            <Card>
              <CardHeader>
                <CardTitle>Legg til ny oppgave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Skriv inn oppgave..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                    className="flex-1"
                  />
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="px-3 py-2 border border-input bg-background rounded-md"
                  >
                    {ROOMS.map((room) => (
                      <option key={room} value={room}>
                        {room}
                      </option>
                    ))}
                  </select>
                  <Button onClick={addTask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Filter Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterRoom === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRoom(null)}
                  >
                    Alle rom ({tasks.length})
                  </Button>
                  {ROOMS.map((room) => {
                    const roomTasks = tasks.filter((task) => task.room === room)
                    return (
                      <Button
                        key={room}
                        variant={filterRoom === room ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterRoom(room)}
                      >
                        {room} ({roomTasks.length})
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            {totalTaskCount > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Fremdrift {filterRoom ? `for ${filterRoom}` : "totalt"}
                    </span>
                    <Badge variant="secondary">
                      {completedTaskCount} av {totalTaskCount} fullført
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${totalTaskCount > 0 ? (completedTaskCount / totalTaskCount) * 100 : 0}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tasks List */}
            {filterRoom ? (
              <Card>
                <CardHeader>
                  <CardTitle>{filterRoom}</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredTasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Ingen oppgaver for {filterRoom}</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredTasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                          {editingTask === task.id ? (
                            <div className="flex-1 flex gap-2">
                              <Input
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                                className="flex-1"
                              />
                              <select
                                value={editingRoom}
                                onChange={(e) => setEditingRoom(e.target.value)}
                                className="px-2 py-1 border border-input bg-background rounded text-sm"
                              >
                                {ROOMS.map((room) => (
                                  <option key={room} value={room}>
                                    {room}
                                  </option>
                                ))}
                              </select>
                              <Button variant="ghost" size="sm" onClick={saveEdit}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                                {task.text}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {task.room}
                              </Badge>
                              <Button variant="ghost" size="sm" onClick={() => startEditing(task)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ROOMS.map((room) => {
                  const roomTasks = tasks.filter((task) => task.room === room)
                  const completedRoomTasks = roomTasks.filter((task) => task.completed).length

                  return (
                    <Card key={room} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{room}</CardTitle>
                          <Badge variant="secondary">
                            {completedRoomTasks}/{roomTasks.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {roomTasks.length === 0 ? (
                          <p className="text-muted-foreground text-sm">Ingen oppgaver</p>
                        ) : (
                          <div className="space-y-2">
                            {roomTasks.slice(0, 3).map((task) => (
                              <div key={task.id} className="flex items-center gap-2">
                                <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                                <span
                                  className={`text-sm flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}
                                >
                                  {task.text}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditing(task)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            {roomTasks.length > 3 && (
                              <p className="text-xs text-muted-foreground">+{roomTasks.length - 3} flere oppgaver</p>
                            )}
                          </div>
                        )}
                        {roomTasks.length > 0 && (
                          <div className="w-full bg-secondary rounded-full h-1 mt-3">
                            <div
                              className="bg-primary h-1 rounded-full transition-all"
                              style={{
                                width: `${roomTasks.length > 0 ? (completedRoomTasks / roomTasks.length) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </>
        )}

        {activeTab === "shopping" && (
          <>
            {/* Add Shopping Item Section - updated to use rooms */}
            <Card>
              <CardHeader>
                <CardTitle>Legg til på innkjøpsliste</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Skriv inn gjenstand..."
                    value={newShoppingItem}
                    onChange={(e) => setNewShoppingItem(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addShoppingItem()}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Antall"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addShoppingItem()}
                    className="w-20"
                  />
                  <select
                    value={selectedShoppingRoom}
                    onChange={(e) => setSelectedShoppingRoom(e.target.value)}
                    className="px-3 py-2 border border-input bg-background rounded-md"
                  >
                    {ROOMS.map((room) => (
                      <option key={room} value={room}>
                        {room}
                      </option>
                    ))}
                  </select>
                  <Button onClick={addShoppingItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Filter Section - updated to use rooms */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterShoppingRoom === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterShoppingRoom(null)}
                  >
                    Alle rom ({shoppingItems.length})
                  </Button>
                  {ROOMS.map((room) => {
                    const roomItems = shoppingItems.filter((item) => item.room === room)
                    return (
                      <Button
                        key={room}
                        variant={filterShoppingRoom === room ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterShoppingRoom(room)}
                      >
                        {room} ({roomItems.length})
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            {totalShoppingCount > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Fremdrift {filterShoppingRoom ? `for ${filterShoppingRoom}` : "totalt"}
                    </span>
                    <Badge variant="secondary">
                      {completedShoppingCount} av {totalShoppingCount} handlet
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${totalShoppingCount > 0 ? (completedShoppingCount / totalShoppingCount) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shopping List - updated to use rooms */}
            {filterShoppingRoom ? (
              <Card>
                <CardHeader>
                  <CardTitle>{filterShoppingRoom}</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredShoppingItems.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Ingen gjenstander for {filterShoppingRoom}</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredShoppingItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Checkbox checked={item.completed} onCheckedChange={() => toggleShoppingItem(item.id)} />
                          {editingShoppingItem === item.id ? (
                            <div className="flex-1 flex gap-2">
                              <Input
                                value={editingShoppingText}
                                onChange={(e) => setEditingShoppingText(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && saveShoppingEdit()}
                                className="flex-1"
                              />
                              <Input
                                value={editingShoppingQuantity}
                                onChange={(e) => setEditingShoppingQuantity(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && saveShoppingEdit()}
                                placeholder="Antall"
                                className="w-20"
                              />
                              <select
                                value={editingShoppingRoom}
                                onChange={(e) => setEditingShoppingRoom(e.target.value)}
                                className="px-2 py-1 border border-input bg-background rounded text-sm"
                              >
                                {ROOMS.map((room) => (
                                  <option key={room} value={room}>
                                    {room}
                                  </option>
                                ))}
                              </select>
                              <Button variant="ghost" size="sm" onClick={saveShoppingEdit}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={cancelShoppingEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1">
                                <span className={`${item.completed ? "line-through text-muted-foreground" : ""}`}>
                                  {item.text}
                                </span>
                                {item.quantity && (
                                  <span
                                    className={`ml-2 text-sm ${item.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}
                                  >
                                    ({item.quantity})
                                  </span>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {item.room}
                              </Badge>
                              <Button variant="ghost" size="sm" onClick={() => startEditingShopping(item)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteShoppingItem(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ROOMS.map((room) => {
                  const roomItems = shoppingItems.filter((item) => item.room === room)
                  const completedRoomItems = roomItems.filter((item) => item.completed).length

                  return (
                    <Card key={room} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{room}</CardTitle>
                          <Badge variant="secondary">
                            {completedRoomItems}/{roomItems.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {roomItems.length === 0 ? (
                          <p className="text-muted-foreground text-sm">Ingen gjenstander</p>
                        ) : (
                          <div className="space-y-2">
                            {roomItems.slice(0, 3).map((item) => (
                              <div key={item.id} className="flex items-center gap-2">
                                <Checkbox
                                  checked={item.completed}
                                  onCheckedChange={() => toggleShoppingItem(item.id)}
                                />
                                <div className="text-sm flex-1">
                                  <span className={`${item.completed ? "line-through text-muted-foreground" : ""}`}>
                                    {item.text}
                                  </span>
                                  {item.quantity && (
                                    <span
                                      className={`ml-1 text-xs ${item.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}
                                    >
                                      ({item.quantity})
                                    </span>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditingShopping(item)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            {roomItems.length > 3 && (
                              <p className="text-xs text-muted-foreground">+{roomItems.length - 3} flere gjenstander</p>
                            )}
                          </div>
                        )}
                        {roomItems.length > 0 && (
                          <div className="w-full bg-secondary rounded-full h-1 mt-3">
                            <div
                              className="bg-primary h-1 rounded-full transition-all"
                              style={{
                                width: `${roomItems.length > 0 ? (completedRoomItems / roomItems.length) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
