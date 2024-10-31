'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, Copy, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export default function Component() {
  const [isLoading, setIsLoading] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [topic, setTopic] = useState('')
  const [context, setContext] = useState('')
  const [names, setNames] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const generateNames = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, context }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate names')
      }

      const data = await response.json()
      setNames([])
      for (let i = 0; i < data.names.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setNames(prev => [...prev, data.names[i]])
      }
      setHasGenerated(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1000)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <nav className="w-full border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="https://mattgiaro.com/">
                <Image
                  src="https://mattgiaro.com/wp-content/uploads/2023/12/matt-giaro-logo-350-70.png"
                  alt="Logo"
                  width={175}
                  height={35}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <div>
              <Link
                href="https://mattgiaro.com/?source=twitter"
                className="inline-flex items-center px-4 py-2 border border-orange-500 text-sm font-medium rounded-md text-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="w-full py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 text-center space-y-8">
            <h1 
              className={cn(
                "text-5xl md:text-7xl font-bold tracking-tight mb-4 transition-all duration-1000 ease-out",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Transform Your Ideas Into
              <span className="block text-orange-500 mt-2">Newsletter Names</span>
            </h1>
            <p 
              className={cn(
                "text-neutral-400 text-xl md:text-2xl max-w-2xl mx-auto transition-all duration-1000 ease-out delay-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Generate the perfect name for your newsletter in seconds with our AI-powered tool.
            </p>
            <div 
              className={cn(
                "transition-all duration-1000 ease-out delay-600",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <Button
                onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-lg transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Generating
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent opacity-50" />
      </header>

      <main id="generator" className="w-full max-w-2xl px-4 py-16 space-y-12">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-light text-neutral-300">Newsletter Topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Technology, Design, Finance..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-12 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context" className="text-sm font-light text-neutral-300">Additional Context (Optional)</Label>
            <Textarea
              id="context"
              placeholder="Describe your newsletter's focus, target audience, or any specific themes..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[100px] bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <Button
            onClick={generateNames}
            disabled={isLoading}
            className={cn(
              "w-full h-12 text-sm font-medium tracking-wide",
              "bg-orange-500 hover:bg-orange-600 text-white",
              "transition-all duration-200"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isLoading ? "Generating..." : hasGenerated ? "Regenerate Names" : "Generate Names"}
          </Button>
        </div>

        {names.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-2xl font-bold mb-4 text-white">Generated Names</h2>
            {names.map((name, index) => (
              <div
                key={name}
                className={cn(
                  "flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg",
                  "transition-all duration-300 ease-out hover:bg-neutral-700/50 hover:scale-[1.02]",
                  "opacity-0 translate-y-4"
                )}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards',
                  animation: 'fadeInUp 0.5s ease-out forwards'
                }}
              >
                <span className="font-light">{name}</span>
                <button
                  onClick={() => copyToClipboard(name, index)}
                  className="flex items-center gap-2 text-sm text-neutral-400 hover:text-orange-500 transition-colors"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="w-full border-t border-neutral-800 py-8 px-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center text-neutral-500 text-sm">
          © {new Date().getFullYear()} Newsletter Name Generator. All rights reserved.
        </div>
      </footer>
    </div>
  )
}