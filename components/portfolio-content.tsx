"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion"
import { X, Github, Linkedin, Mail, Phone, Send, ArrowRight, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import type { TranslationKey } from "@/lib/translations"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.34, 1.1, 0.64, 1] },
  }),
}

// Tech stack with actual SVG icons
const techStack = [
  { 
    name: "Python", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
      </svg>
    )
  },
  { 
    name: "HTML", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#E34F26">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
      </svg>
    )
  },
  { 
    name: "CSS", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#1572B6">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/>
      </svg>
    )
  },
  { 
    name: "JavaScript", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#F7DF1E">
        <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
      </svg>
    )
  },
  { 
    name: "MySQL", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#4479A1">
        <path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.063h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.72-1.01 1.08-1.582 1.08-.16 0-.356-.054-.588-.16v-.52c.113.017.234.026.363.026.2 0 .373-.062.52-.188.16-.132.293-.308.4-.526.12-.245.178-.396.178-.452 0-.025-.01-.082-.032-.174l-1.143-4.546h.814l.686 2.934c.152.64.258 1.226.318 1.756.378-1.4.64-2.74.786-4.014h.79v.324zm5.263 2.347c0 .606-.16 1.076-.48 1.41-.32.332-.752.5-1.294.5-.528 0-.96-.158-1.296-.48-.334-.317-.5-.78-.5-1.388 0-.63.17-1.12.502-1.462.336-.346.767-.52 1.294-.52.54 0 .97.167 1.294.502.326.33.49.8.49 1.407h-.01v.03zm-.85.06c0-.37-.083-.654-.25-.854-.16-.2-.397-.3-.7-.3-.294 0-.53.1-.714.298-.182.2-.273.486-.273.864 0 .35.09.625.273.825.183.2.42.3.714.3.303 0 .536-.1.7-.298.167-.2.25-.48.25-.838zm4.336 1.673h-1.26v-4.71h-.88v-.5h.88v-.295c0-.356.094-.636.28-.84.193-.206.49-.308.89-.308.153 0 .34.014.562.04v.52c-.126-.016-.27-.022-.43-.022-.203 0-.35.055-.44.164-.09.11-.134.284-.134.52v.22h.946v.5h-.946v4.71h.532zm2.36-3.44c0 .615-.14 1.09-.42 1.427-.28.34-.666.508-1.154.508-.47 0-.854-.17-1.154-.51-.3-.337-.45-.812-.45-1.425 0-.62.15-1.098.45-1.434.3-.337.684-.506 1.154-.506.48 0 .867.17 1.154.507.28.334.42.81.42 1.433zm-.766.04c0-.37-.075-.66-.224-.87-.15-.21-.36-.317-.632-.317-.26 0-.472.107-.634.318-.164.21-.246.5-.246.87 0 .38.082.672.246.878.162.207.374.31.634.31.27 0 .482-.102.633-.31.15-.206.223-.498.223-.878z"/>
      </svg>
    )
  },
  { 
    name: "FastAPI", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#009688">
        <path d="M12 0C5.375 0 0 5.375 0 12c0 6.627 5.375 12 12 12 6.626 0 12-5.373 12-12 0-6.625-5.373-12-12-12zm-.624 21.62v-7.528H7.19L13.203 2.38v7.528h4.029L11.376 21.62z"/>
      </svg>
    )
  },
  { 
    name: "n8n", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#EA4B71">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.6c-5.302 0-9.6-4.298-9.6-9.6S6.698 2.4 12 2.4s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6zm-1.8-14.4v9.6h3.6V7.2h-3.6z"/>
      </svg>
    )
  },
  { 
    name: "C#", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#512BD4">
        <path d="M11.5 15.97l.01-2.07c0-.55.45-1 1-1s1 .45 1 1l-.01 2.08c0 .55-.45 1-1 1s-1-.45-1-1.01zm7.57-11.04L12.7 1.4c-.42-.24-.95-.24-1.37 0L4.96 5.07c-.43.25-.69.7-.69 1.18v7.35c0 .48.26.93.69 1.18l6.37 3.68c.21.12.45.18.7.18.24 0 .49-.06.7-.18l6.38-3.68c.43-.25.69-.7.69-1.18V6.25c0-.48-.26-.93-.7-1.18l.01-.14zM16 11.97v-1h-1v1h-1v-1h-1v1h-1v-1h-1v1H9v-1H8v1H7.03V9.97H8v-1H7.03V7.97H8v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v1.03h-1v1zm0-2.03h-1v1h1v-1zm-2 0h-1v1h1v-1zm-2 0h-1v1h1v-1z"/>
      </svg>
    )
  },
  { 
    name: "React", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#61DAFB">
        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/>
      </svg>
    )
  },
  { 
    name: "Next.js", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-foreground">
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/>
      </svg>
    )
  },
  { 
    name: "TypeScript", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#3178C6">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
      </svg>
    )
  },
  { 
    name: "Tailwind CSS", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#06B6D4">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
      </svg>
    )
  },
  { 
    name: "Git", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#F05032">
        <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/>
      </svg>
    )
  },
  { 
    name: "GitHub", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-foreground">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    )
  },
  { 
    name: "Vercel", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-foreground">
        <path d="M24 22.525H0l12-21.05 12 21.05z"/>
      </svg>
    )
  },
]

// Projects data - 4 projects
const projects = [
  {
    id: "01",
    title: "LuxTime - Sitio Web Corporativo",
    description: "Maqueta HTML y CSS del sitio web corporativo de LuxTime, una marca de relojes de lujo. El objetivo es representar visualmente todas las paginas y funcionalidades principales de la marca, sin incluir logica funcional ni backend.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202026-03-30%20a%20la%28s%29%204.56.07%20p.m.-p8IWCEyHzpIgMvsUKlb5Fsml5tbEa3.png",
    tags: ["HTML", "CSS"],
  },
  {
    id: "02",
    title: "Bot de Telegram con n8n",
    description: "Bot conversacional en Telegram que opera como una maquina de estados persistente usando Google Sheets como base de datos. Permite navegar por un menu numerico y ejecutar wizards para gestionar citas, tareas, recordatorios, habitos, listas, reportes y configuracion.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_c7ndjxc7ndjxc7nd.png-1QJTMB4mnUzouQOCjPYJfg54A7fQII.jpeg",
    tags: ["n8n"],
  },
  {
    id: "03",
    title: "Simulador Liga BetPlay",
    description: "Simulacion funcional de la Liga BetPlay desde consola, aplicando Programacion Orientada a Objetos (POO), estructuras de datos en memoria y consultas LINQ. Permite registrar equipos, simular encuentros deportivos, actualizar estadisticas automaticamente y consultar metricas del torneo.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-TANLsqzeplhLKi2mE9aLDkmoWhcsEj.png",
    tags: ["C#"],
  },
  {
    id: "04",
    title: "Hotel Rincon del Carmen",
    description: "Sitio web interactivo para Hotel el Rincon del Carmen. Los usuarios pueden consultar disponibilidad, reservar habitaciones y gestionar sus reservas. Los administradores pueden gestionar habitaciones y reservas eficientemente.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202026-03-30%20a%20la%28s%29%205.04.52%20p.m.-V1qUK3uwKBncAXvdy9L40uhxD2wsvO.png",
    tags: ["HTML", "CSS", "JavaScript"],
  },
]

const experience = [
  {
    role: "Base de Datos MySQL - Pizzeria",
    company: "Colombia - Remote",
    period: "Nov 2025 — Presente",
    description: "Disene y normalice una base de datos relacional para una pizzeria, gestionando tablas de clientes, ingredientes, pedidos y ventas. Aplique las tres formas normales para optimizar la estructura y garantizar integridad referencial. Realice consultas complejas con JOIN, GROUP BY y subconsultas para obtener reportes de ventas y clientes frecuentes.",
    tags: ["MySQL"],
  },
  {
    role: "Proyecto API con FastAPI",
    company: "Colombia - Remote",
    period: "Oct 2025 — Presente",
    description: "Desarrolle una API RESTful utilizando FastAPI, orientada a la gestion de datos de usuarios y productos. Implemente operaciones CRUD completas, manejo de rutas dinamicas, validaciones con Pydantic y persistencia en archivos JSON. Incorpore respuestas HTTP personalizadas, control de errores y documentacion automatica con Swagger UI.",
    tags: ["FastAPI", "Python"],
  },
  {
    role: "Proyecto Hotel Rincon del Carmen",
    company: "Colombia - Remote",
    period: "Sep 2025 — Presente",
    description: "Desarrolle la interfaz web del proyecto Hotel Rincon del Carmen, aplicando HTML, CSS y JavaScript para crear un sitio funcional, moderno y adaptable. El proyecto consistio en el diseno de un portal informativo para un hotel, con secciones de reservas, galeria, contacto y servicios.",
    tags: ["JavaScript", "HTML", "CSS"],
  },
  {
    role: "Proyecto CRUD Libreria Virtual",
    company: "Colombia - Remote",
    period: "Aug 2025 — Presente",
    description: "Participe en el desarrollo completo de un sistema CRUD en Python, utilizando archivos JSON para la persistencia de datos. Implemente funciones con validaciones, manejo de errores (try-except) y modularizacion del codigo. Disene una estructura limpia y reutilizable, aplicando principios de programacion estructurada.",
    tags: ["Python"],
  },
]

// Photo stack images
const aboutPhotos = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-30%20at%204.37.44%20PM-JM1bFVNlFj2xFrpEZORF3ybPXe9pQY.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-30%20at%204.37.28%20PM-lCvYT6QEgDdLbVkv1wJjJ1TVDlWqux.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-30%20at%204.42.40%20PM-r86hzi9zdY1De25OvatgmJB6lGdqdn.jpeg",
]

export default function PortfolioContent() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("sending")
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        setFormStatus("success")
        setFormData({ name: "", email: "", message: "" })
        setTimeout(() => setFormStatus("idle"), 3000)
      } else {
        setFormStatus("error")
        setTimeout(() => setFormStatus("idle"), 3000)
      }
    } catch {
      setFormStatus("error")
      setTimeout(() => setFormStatus("idle"), 3000)
    }
  }

  return (
    <main className="font-sans min-h-screen bg-background">
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden"
        aria-label="Presentacion"
      >
        {/* decorative radial glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 500,
            background: "radial-gradient(ellipse, var(--glow-color), transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <motion.p
          className="font-mono text-xs tracking-[0.35em] uppercase mb-6 text-primary/70"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {t.hero.role}
        </motion.p>

        <motion.h1
          className="text-balance leading-none mb-8 text-foreground"
          style={{
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {t.hero.title1}
          <br />
          <span
            className="italic"
            style={{
              background: "linear-gradient(120deg, var(--pink-soft), var(--pink-rose), var(--pink-deep))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t.hero.title2}
          </span>
        </motion.h1>

        <motion.p
          className="max-w-md leading-relaxed text-lg font-light mb-12 text-muted-foreground"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {t.hero.description}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <a
            href="#trabajo"
            className="px-8 py-3 rounded-full font-mono text-xs tracking-[0.18em] uppercase transition-all duration-300 bg-primary text-primary-foreground hover:bg-accent"
          >
            {t.hero.viewWork}
          </a>
          <a
            href="#sobre-mi"
            className="px-8 py-3 rounded-full font-mono text-xs tracking-[0.18em] uppercase transition-all duration-300 border border-border text-muted-foreground hover:border-primary/50 hover:text-accent"
          >
            {t.hero.aboutMe}
          </a>
        </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="font-mono text-xs tracking-[0.25em] uppercase text-muted-foreground/50">
          {t.hero.scroll}
        </span>
          <motion.div
            className="w-px h-10 bg-primary/40"
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* Tech Stack Section */}
      <section className="px-6 md:px-16 pb-32" aria-label="Mi Stack">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-6xl font-light text-foreground">
            {t.techStack.title.split(" ")[0]}{" "}
            <span className="italic text-primary">{t.techStack.titleHighlight}</span>
          </h2>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full font-mono text-sm bg-card border border-border/60 text-foreground hover:border-primary/50 transition-all duration-200"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              {tech.icon}
              {tech.name}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Sobre mi with Stacked Photo Effect */}
      <section
        id="sobre-mi"
        className="px-6 md:px-16 pb-32"
        aria-label="Sobre mi"
      >
        <motion.p
          className="font-mono text-xs tracking-[0.35em] uppercase mb-8 text-primary/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {t.about.title}
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-8 text-foreground">
              {t.about.subtitle}
              <br />
              {t.about.subtitleLine2}{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(120deg, var(--pink-soft), var(--pink-rose))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t.about.subtitleHighlight}
              </span>
            </h2>

            <div className="flex flex-col gap-6 text-muted-foreground">
              <p className="text-base leading-relaxed font-light">
                {t.about.description1}
              </p>
              <p className="text-base leading-relaxed font-light">
                {t.about.description2}
              </p>
              <p className="text-base leading-relaxed font-light">
                {t.about.description3}
              </p>
            </div>
          </motion.div>

          {/* Right: Stacked Photo Effect (like parthsharma.me) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <StackedPhotos photos={aboutPhotos} />
          </motion.div>
        </div>
      </section>

      {/* Experiencia Laboral */}
      <section className="px-6 md:px-16 pb-32" aria-label="Experiencia">
        <motion.p
          className="font-mono text-xs tracking-[0.35em] uppercase mb-8 text-primary/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {t.experience.title}
        </motion.p>

        <div className="flex flex-col gap-0">
          {t.experience.jobs.map((exp, i) => (
            <motion.div
              key={exp.role + exp.company}
              className="py-8 border-b border-border/60"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl md:text-2xl font-light text-foreground">
                    {exp.role}
                  </h3>
                  <p className="font-mono text-sm text-primary">
                    {exp.company}
                  </p>
                </div>
                <span className="font-mono text-xs tracking-wider text-muted-foreground/70">
                  {exp.period}
                </span>
              </div>
              <p className="text-sm font-light leading-relaxed max-w-2xl text-muted-foreground mb-3">
                {exp.description}
              </p>
              {experience[i]?.tags && (
                <div className="flex flex-wrap gap-2">
                  {experience[i].tags.map((tag) => {
                    const tech = techStack.find(t => t.name === tag)
                    return (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs bg-secondary border border-border/60 text-secondary-foreground"
                      >
                        {tech?.icon}
                        {tag}
                      </span>
                    )
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Proyectos - Horizontal Draggable Carousel with Pink Gradient Cards */}
      <section
        id="trabajo"
        className="pb-32"
        aria-label="Proyectos"
      >
        <div className="px-6 md:px-16">
          <motion.p
            className="font-mono text-xs tracking-[0.5em] uppercase mb-8 text-primary/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.projects.title}
          </motion.p>
        </div>

        <ProjectsCarousel projects={projects} t={t} />
      </section>

      {/* Contacto */}
      <section
        id="contacto"
        className="px-6 md:px-16 pb-32 flex flex-col items-center text-center gap-8"
        aria-label="Contacto"
      >
        <motion.div
          className="relative p-10 md:p-14 rounded-3xl w-full overflow-hidden bg-card border border-border/50"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 100%, var(--glow-color), transparent)",
              opacity: 0.3
            }}
          />
          <p className="font-mono text-xs tracking-[0.35em] uppercase mb-4 text-primary/70">
            {t.contactSection.title}
          </p>
          <h2 className="text-balance text-4xl md:text-5xl font-light mb-4 text-foreground">
            {t.contactSection.question}{" "}
            <span className="italic text-primary">{t.contactSection.questionHighlight}</span>
          </h2>
          <p className="max-w-md mx-auto leading-relaxed mb-6 text-muted-foreground">
            {t.contactSection.description}
          </p>
          <button
            onClick={() => setIsContactOpen(true)}
            className="inline-flex px-10 py-4 rounded-full font-mono text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer bg-primary text-primary-foreground hover:bg-accent"
            style={{
              boxShadow: "0 0 40px var(--glow-color)",
            }}
          >
            {t.contactSection.button}
          </button>
        </motion.div>
      </section>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-lg rounded-3xl p-8 md:p-10 pointer-events-auto overflow-hidden max-h-[90vh] overflow-y-auto bg-card border border-border/50"
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
              >
                {/* Glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 80% 60% at 50% 0%, var(--glow-color), transparent)",
                    opacity: 0.3
                  }}
                />

                {/* Close button */}
                <button
                  onClick={() => setIsContactOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-full transition-colors cursor-pointer text-muted-foreground hover:text-primary"
                  aria-label={t.contactModal.close}
                >
                  <X size={20} />
                </button>

                <h3 className="text-2xl md:text-3xl font-light mb-2 text-foreground">
                  {t.contactModal.title}
                </h3>
                <p className="text-sm mb-8 text-muted-foreground">
                  {t.contactModal.subtitle}
                </p>

                {/* Status Messages */}
                {formStatus === "success" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500"
                  >
                    <CheckCircle size={16} />
                    <span className="font-mono text-xs">{t.contactModal.successMessage}</span>
                  </motion.div>
                )}
                {formStatus === "error" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500"
                  >
                    <AlertCircle size={16} />
                    <span className="font-mono text-xs">{t.contactModal.errorMessage}</span>
                  </motion.div>
                )}

                {/* Contact Form */}
                <form className="flex flex-col gap-4 mb-8" onSubmit={handleSubmit}>
                  <div>
                    <label className="block font-mono text-xs tracking-wider mb-2 text-muted-foreground">
                      {t.contactModal.nameLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={t.contactModal.namePlaceholder}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl font-mono text-sm outline-none transition-all duration-200 bg-background border border-border text-foreground focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs tracking-wider mb-2 text-muted-foreground">
                      {t.contactModal.emailLabel}
                    </label>
                    <input
                      type="email"
                      placeholder={t.contactModal.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl font-mono text-sm outline-none transition-all duration-200 bg-background border border-border text-foreground focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs tracking-wider mb-2 text-muted-foreground">
                      {t.contactModal.messageLabel}
                    </label>
                    <textarea
                      placeholder={t.contactModal.messagePlaceholder}
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl font-mono text-sm outline-none resize-none transition-all duration-200 bg-background border border-border text-foreground focus:border-primary/50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === "sending"}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono text-xs tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer bg-primary text-primary-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={14} />
                    {formStatus === "sending" ? t.contactModal.sending : t.contactModal.sendButton}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="font-mono text-xs text-muted-foreground/70">
                    {t.contactModal.orContactBy}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-3 mb-6">
                  <a
                    href="https://wa.me/522022873946"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-background border border-border text-foreground hover:border-primary/50"
                  >
                    <Phone size={18} className="text-primary" />
                    <span className="font-mono text-sm">+52 202 287 3946</span>
                  </a>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=wendyangelicavega@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-background border border-border text-foreground hover:border-primary/50"
                  >
                    <Mail size={18} className="text-primary" />
                    <span className="font-mono text-sm">wendyangelicavega@gmail.com</span>
                  </a>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-4">
                  {[
                    { icon: Github, href: "https://github.com/wen-27", label: "GitHub" },
                    { icon: Linkedin, href: "https://www.linkedin.com/in/wendy-angelica-vega-s%C3%A1nchez-7453a5381/", label: "LinkedIn" },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl transition-all duration-200 bg-background border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                      aria-label={label}
                    >
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}

// Stacked Photos Component (like parthsharma.me about section)
function StackedPhotos({ photos }: { photos: string[] }) {
  const [activeIndex, setActiveIndex] = useState(photos.length - 1)
  const { t } = useLanguage()
  
  const handleClick = () => {
    // Move the top card to the back
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  // Calculate the order of cards based on activeIndex
  const getCardStyle = (index: number) => {
    const totalCards = photos.length
    // Calculate position relative to the active (top) card
    const relativePosition = (index - activeIndex + totalCards) % totalCards
    
    // Map position to visual stack order (0 = top, higher = back)
    const stackPosition = relativePosition
    
    // Cards further back are offset more
    const translateX = stackPosition * -25
    const translateY = stackPosition * 15
    const rotate = stackPosition * -8
    const scale = 1 - stackPosition * 0.05
    const zIndex = totalCards - stackPosition
    const opacity = stackPosition < 3 ? 1 : 0.5
    
    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
      zIndex,
      opacity,
    }
  }

  return (
    <div 
      className="relative w-full h-[450px] flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      {photos.map((photo, index) => (
        <motion.div
          key={index}
          className="absolute rounded-3xl overflow-hidden shadow-2xl bg-card border border-border/30"
          style={{
            width: 280,
            height: 380,
            ...getCardStyle(index),
          }}
          animate={getCardStyle(index)}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          whileHover={index === activeIndex ? { scale: 1.02 } : {}}
        >
          <Image
            src={photo}
            alt={`Foto ${index + 1}`}
            fill
            className="object-cover pointer-events-none"
            draggable={false}
          />
        </motion.div>
      ))}
      
      {/* Click hint */}
      <motion.p 
        className="absolute -bottom-8 font-mono text-xs text-muted-foreground/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {t.about.clickToSeeMore}
      </motion.p>
    </div>
  )
}

// Projects Horizontal Carousel with Pink Gradient Cards (like parthsharma.me)
function ProjectsCarousel({ projects, t }: { projects: typeof import("./portfolio-content").default extends () => infer R ? R : never extends { projects: infer P } ? P : typeof projects, t: TranslationKey }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const cardWidth = 550
  const gap = 24
  const padding = 64

  const goToNext = () => {
    if (currentIndex < projects.length - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      x.set(-(cardWidth + gap) * newIndex)
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      x.set(-(cardWidth + gap) * newIndex)
    }
  }

  return (
    <div className="relative">
      <motion.div
        ref={containerRef}
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          style={{ 
            gap,
            paddingLeft: padding,
            x,
          }}
          drag="x"
          dragConstraints={{
            left: -(cardWidth + gap) * (projects.length - 1),
            right: 0,
          }}
          dragElastic={0.05}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
        >
          {projects.map((project, index) => {
            const translatedProject = t.projects.items[index]
            return (
            <motion.div
              key={project.id}
              className="relative flex-shrink-0 rounded-3xl overflow-hidden group bg-card border border-border/30 flex flex-col"
              style={{ width: cardWidth, height: 520 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Pink gradient section */}
              <div 
                className="p-8 pb-6 rounded-t-3xl flex-1 flex flex-col"
                style={{
                  background: "linear-gradient(135deg, oklch(0.85 0.05 350), oklch(0.92 0.03 340))",
                }}
              >
                {/* Top section: Text */}
                <p className="text-gray-800 text-sm font-medium leading-relaxed mb-4 max-w-md h-[72px] overflow-hidden line-clamp-3">
                  {translatedProject?.description || project.description}
                </p>
                
                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => {
                    const tech = techStack.find(t => t.name === tag)
                    return (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs bg-white/80 border border-gray-300 text-gray-700"
                      >
                        {tech?.icon}
                        {tag}
                      </span>
                    )
                  })}
                </div>
                
                {/* Browser mockup with project preview */}
                <div className="rounded-2xl overflow-hidden bg-black/20 border border-white/10">
                  {/* Browser header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-black/30 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 rounded-full bg-white/10 text-white/50 text-xs font-mono">
                        {(translatedProject?.title || project.title).toLowerCase().replace(/ /g, "-")}.com
                      </div>
                    </div>
                  </div>
                  
                  {/* Project image */}
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={project.image}
                      alt={translatedProject?.title || project.title}
                      fill
                      className="object-cover pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom section: Project info panel */}
              <div className="bg-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Pink accent bar */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1 h-5 rounded-full bg-primary" />
                      <h3 className="text-lg font-light text-foreground">
                        {translatedProject?.title || project.title}
                      </h3>
                    </div>
                    
                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => {
                        const tech = techStack.find(t => t.name === tag)
                        return (
                          <span
                            key={tag}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs bg-secondary border border-border/60 text-secondary-foreground"
                          >
                            {tech?.icon}
                            {tag}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <motion.div
                    className="p-2 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 3 }}
                  >
                    <ArrowRight size={18} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )})}
        </motion.div>
      </motion.div>

      {/* Navigation controls */}
      <motion.div 
        className="flex items-center justify-center gap-4 mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={t.projects.prev}
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-mono text-xs tracking-wider uppercase text-muted-foreground/60">
          {currentIndex + 1} / {projects.length}
        </span>
        <button
          onClick={goToNext}
          disabled={currentIndex === projects.length - 1}
          className="p-2 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={t.projects.next}
        >
          <ChevronRight size={20} />
        </button>
      </motion.div>
    </div>
  )
}
