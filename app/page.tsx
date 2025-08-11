"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button" // Button komponentini əlavə etdik
import { Badge } from "@/components/ui/badge"
import { Check, X, AlertCircle, Share2 } from "lucide-react" // Share2 ikonunu əlavə etdik
import { useToast } from "@/hooks/use-toast" // Toast bildirişləri üçün

interface Rule {
  id: number
  text: string
  check: (password: string) => boolean
  active: boolean
  satisfied: boolean
  category: string
}

export default function PasswordGameAZ() {
  const [email, setEmail] = useState("")
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false)
  const [password, setPassword] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [newRuleId, setNewRuleId] = useState<number | null>(null)
  const [completedRuleId, setCompletedRuleId] = useState<number | null>(null)
  const { toast } = useToast() // Toast hookunu istifadə etdik

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const rules: Rule[] = useMemo(
    () => [
      // Əsas qaydalar (1-20)
      {
        id: 1,
        text: "Şifrəniz ən azı 5 simvol olmalıdır",
        check: (p) => p.length >= 5,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 2,
        text: "Şifrəniz ən azı 1 rəqəm ehtiva etməlidir",
        check: (p) => /\d/.test(p),
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 3,
        text: "Şifrəniz ən azı 1 böyük hərf ehtiva etməlidir",
        check: (p) => /[A-ZÇĞIİÖŞÜ]/.test(p),
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 4,
        text: "Şifrəniz ən azı 1 kiçik hərf ehtiva etməlidir",
        check: (p) => /[a-zçğıiöşü]/.test(p),
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 5,
        text: "Şifrəniz ən azı 8 simvol olmalıdır",
        check: (p) => p.length >= 8,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 6,
        text: "Şifrəniz xüsusi simvol ehtiva etməlidir (!@#$%^&*)",
        check: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 7,
        text: "Şifrəniz 'Bakı' sözünü ehtiva etməlidir",
        check: (p) => p.includes("Bakı"),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 8,
        text: "Şifrəniz 'Azərbaycan' sözünü ehtiva etməlidir",
        check: (p) => p.includes("Azərbaycan"),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 9,
        text: "Şifrəniz ən azı 12 simvol olmalıdır",
        check: (p) => p.length >= 12,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 10,
        text: "Şifrəniz Roma rəqəmi ehtiva etməlidir",
        check: (p) => /[IVXLCDM]/.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 11,
        text: "Şifrəniz ən azı 3 sait hərf ardıcıl ehtiva etməlidir (məsələn: aei, oua)",
        check: (p) => {
          const vowels = "aeiouəıöü"
          for (let i = 0; i <= p.length - 3; i++) {
            let consecutiveVowels = 0
            for (let j = i; j < p.length; j++) {
              if (vowels.includes(p[j].toLowerCase())) {
                consecutiveVowels++
                if (consecutiveVowels >= 3) return true
              } else {
                break
              }
            }
          }
          return false
        },
        active: false,
        satisfied: false,
        category: "Dil",
      },
      {
        id: 12,
        text: "Şifrəniz ayın adını ehtiva etməlidir",
        check: (p) => /yanvar|fevral|mart|aprel|may|iyun|iyul|avqust|sentyabr|oktyabr|noyabr|dekabr/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 13,
        text: "Şifrəniz emoji ehtiva etməlidir",
        check: (p) =>
          /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(p),
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 14,
        text: "Şifrəniz palindrom ehtiva etməlidir (ən azı 3 hərf)",
        check: (p) => {
          for (let i = 0; i <= p.length - 3; i++) {
            for (let j = i + 3; j <= p.length; j++) {
              const substr = p.substring(i, j)
              if (substr === substr.split("").reverse().join("")) return true
            }
          }
          return false
        },
        active: false,
        satisfied: false,
        category: "Dil",
      },
      {
        id: 15,
        text: "Şifrəniz bugünkü tarixi ehtiva etməlidir (GG.AA.YYYY)",
        check: (p) => {
          const today = new Date()
          const dateStr = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`
          return p.includes(dateStr)
        },
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 16,
        text: "Şifrəniz Azərbaycan şəhərinin adını ehtiva etməlidir",
        check: (p) => /Bakı|Gəncə|Sumqayıt|Mingəçevir|Şəki|Quba|Lənkəran|Şamaxı|Qəbələ|Naxçıvan/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 17,
        text: "Şifrəniz ən azı 2 dəfə təkrarlanan hərf ehtiva etməlidir",
        check: (p) => {
          const charCount = {}
          for (const char of p) {
            charCount[char] = (charCount[char] || 0) + 1
            if (charCount[char] >= 2) return true
          }
          return false
        },
        active: false,
        satisfied: false,
        category: "Struktur",
      },
      {
        id: 18,
        text: "Şifrəniz rəng adını ehtiva etməlidir",
        check: (p) => /qırmızı|mavi|yaşıl|sarı|qara|ağ|bənövşəyi|çəhrayı|narıncı|qəhvəyi/i.test(p),
        active: false,
        satisfied: false,
        category: "Rəng",
      },
      {
        id: 19,
        text: "Şifrəniz ən azı 15 simvol olmalıdır",
        check: (p) => p.length >= 15,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 20,
        text: "Şifrəniz heyvan adını ehtiva etməlidir",
        check: (p) => /it|pişik|at|inək|qoyun|quş|balıq|arı|kəpənək|aslan|pələng|fil/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },

      // Orta səviyyə qaydalar (21-50)
      {
        id: 21,
        text: "Şifrəniz Fibonacci rəqəmi ehtiva etməlidir",
        check: (p) => {
          const fibs = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
          return fibs.some((fib) => p.includes(fib.toString()))
        },
        active: false,
        satisfied: false,
        category: "Riyaziyyat",
      },
      {
        id: 22,
        text: "Şifrəniz həftənin günü adını ehtiva etməlidir",
        check: (p) => /bazar|bazar ertəsi|çərşənbə axşamı|çərşənbə|cümə axşamı|cümə|şənbə/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 23,
        text: "Şifrəniz musiqi alətinin adını ehtiva etməlidir",
        check: (p) => /piano|gitara|skripka|davul|zurna|tar|kamança|ud|qanun|balaban/i.test(p),
        active: false,
        satisfied: false,
        category: "Musiqi",
      },
      {
        id: 24,
        text: "Şifrəniz məşhur Azərbaycan abidəsinin adını ehtiva etməlidir (məsələn: Qız Qalası, Alov Qüllələri)",
        check: (p) => /Qız Qalası|Alov Qüllələri|İçərişəhər|Şirvanşahlar Sarayı|Yanar Dağ|Atəşgah/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 25,
        text: "Şifrəniz kimyəvi elementin simvolunu ehtiva etməlidir",
        check: (p) => /H|He|Li|Be|B|C|N|O|F|Ne|Na|Mg|Al|Si|P|S|Cl|Ar|K|Ca|Fe|Cu|Zn|Ag|Au|Pb/.test(p),
        active: false,
        satisfied: false,
        category: "Elm",
      },
      {
        id: 26,
        text: "Şifrəniz ən azı 20 simvol olmalıdır",
        check: (p) => p.length >= 20,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 27,
        text: "Şifrəniz məşhur Azərbaycan yazıçısının adını ehtiva etməlidir",
        check: (p) => /Nizami|Füzuli|Nəsimi|Vaqif|Sabir|Haqverdiyev|Cəlil|Rəsul|Elçin/i.test(p),
        active: false,
        satisfied: false,
        category: "Ədəbiyyat",
      },
      {
        id: 28,
        text: "Şifrəniz 'Xəzər' sözünü ehtiva etməlidir",
        check: (p) => p.includes("Xəzər"),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 29,
        text: "Şifrəniz planet adını ehtiva etməlidir",
        check: (p) => /Merkuri|Venera|Yer|Mars|Yupiter|Saturn|Uran|Neptun/i.test(p),
        active: false,
        satisfied: false,
        category: "Astronomiya",
      },
      {
        id: 30,
        text: "Şifrəniz ən azı 2 dəfə təkrarlanan rəqəm ehtiva etməlidir",
        check: (p) => {
          const digitCount = {}
          for (const char of p) {
            if (/\d/.test(char)) {
              digitCount[char] = (digitCount[char] || 0) + 1
              if (digitCount[char] >= 2) return true
            }
          }
          return false
        },
        active: false,
        satisfied: false,
        category: "Struktur",
      },
      {
        id: 31,
        text: "Şifrəniz Azərbaycan milli yeməyinin adını ehtiva etməlidir",
        check: (p) => /plov|dolma|kebab|qutab|lavangi|düşbərə|xəngəl|bozbash|dövğa|şəkərbura/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 32,
        text: "Şifrəniz ən azı 2 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 2
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 33,
        text: "Şifrəniz 'Qarabağ' sözünü ehtiva etməlidir",
        check: (p) => p.includes("Qarabağ"),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 34,
        text: "Şifrəniz Azərbaycan dağının adını ehtiva etməlidir",
        check: (p) => /Bazardüzü|Şahdağ|Tufandağ|Qapıcıq|Babadağ|Murovdağ/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 35,
        text: "Şifrəniz ən azı 25 simvol olmalıdır",
        check: (p) => p.length >= 25,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 36,
        text: "Şifrəniz Azərbaycan çayının adını ehtiva etməlidir",
        check: (p) => /Kür|Araz|Qabırry|Samur|Pirsaat|Tərtər|Xəzər/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 37,
        text: "Şifrəniz ən azı 3 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 3
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 38,
        text: "Şifrəniz Azərbaycan milli rəqsinin adını ehtiva etməlidir",
        check: (p) => /yallı|lezginka|qaytağı|uzundərə|ceyrani|əlvəda/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 39,
        text: "Şifrəniz ən azı 4 sait hərf ehtiva etməlidir",
        check: (p) => {
          const vowelCount = (p.match(/[aeiouəıöü]/gi) || []).length
          return vowelCount >= 4
        },
        active: false,
        satisfied: false,
        category: "Dil",
      },
      {
        id: 40,
        text: "Şifrəniz Azərbaycan xalça növünün adını ehtiva etməlidir",
        check: (p) => /Qəbələ|Şirvan|Quba|Bakı|Qarabağ|Təbriz|Gəncə/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 41,
        text: "Şifrəniz ən azı 6 fərqli böyük hərf ehtiva etməlidir",
        check: (p) => {
          const upperCount = new Set(p.match(/[A-ZÇĞIİÖŞÜ]/g) || [])
          return upperCount.size >= 6
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 42,
        text: "Şifrəniz Azərbaycan milli oyununun adını ehtiva etməlidir",
        check: (p) => /cövkan|çövgən|zorxana|güləş|atçılıq/i.test(p),
        active: false,
        satisfied: false,
        category: "İdman",
      },
      {
        id: 43,
        text: "Şifrəniz ən azı 30 simvol olmalıdır",
        check: (p) => p.length >= 30,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 44,
        text: "Şifrəniz Azərbaycan neft yatağının adını ehtiva etməlidir",
        check: (p) => /Azəri|Çıraq|Günəşli|Şahdəniz|Abşeron|Sangaçal/i.test(p),
        active: false,
        satisfied: false,
        category: "İqtisadiyyat",
      },
      {
        id: 45,
        text: "Şifrəniz ən azı 2 Roma rəqəmi ehtiva etməlidir",
        check: (p) => {
          const romanCount = (p.match(/[IVXLCDM]/g) || []).length
          return romanCount >= 2
        },
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 46,
        text: "Şifrəniz Azərbaycan universiteti adını ehtiva etməlidir",
        check: (p) => /BDU|ADNSU|AzTU|AMEA|UNEC|ADU|ANAS/i.test(p),
        active: false,
        satisfied: false,
        category: "Təhsil",
      },
      {
        id: 47,
        text: "Şifrəniz ən azı 3 palindrom ehtiva etməlidir",
        check: (p) => {
          let count = 0
          for (let i = 0; i <= p.length - 3; i++) {
            for (let j = i + 3; j <= p.length; j++) {
              const substr = p.substring(i, j)
              if (substr === substr.split("").reverse().join("")) count++
            }
          }
          return count >= 3
        },
        active: false,
        satisfied: false,
        category: "Dil",
      },
      {
        id: 48,
        text: "Şifrəniz Azərbaycan milli alətinin adını ehtiva etməlidir",
        check: (p) => /tar|kamança|ud|qanun|nağara|zurna|balaban|tutek/i.test(p),
        active: false,
        satisfied: false,
        category: "Musiqi",
      },
      {
        id: 49,
        text: "Şifrəniz ən azı 3 fərqli xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specials = new Set(p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || [])
          return specials.size >= 3
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 50,
        text: "Şifrəniz Azərbaycan milli bayramının adını ehtiva etməlidir",
        check: (p) => /Novruz|Respublika|Müstəqillik|Qələbə|Bayraq|Dövlət|Milli/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },

      // Çətin qaydalar (51-100)
      {
        id: 51,
        text: "Şifrəniz ən azı 35 simvol olmalıdır",
        check: (p) => p.length >= 35,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 52,
        text: "Şifrəniz hazırkı saatı ehtiva etməlidir (SS:DD)",
        check: (p) => {
          const now = currentTime
          const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
          return p.includes(timeStr)
        },
        active: false,
        satisfied: false,
        category: "Vaxt",
      },
      {
        id: 53,
        text: "Şifrəniz Azərbaycan şairinin beytini ehtiva etməlidir",
        check: (p) => /gəl|könül|sevgi|məhəbbət|vətən|dağlar|dəniz|göy|ulduz|ay/i.test(p),
        active: false,
        satisfied: false,
        category: "Ədəbiyyat",
      },
      {
        id: 54,
        text: "Şifrəniz ən azı 5 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 5
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 55,
        text: "Şifrəniz Azərbaycan milli valyutasını ehtiva etməlidir",
        check: (p) => /manat|qəpik|AZN/i.test(p),
        active: false,
        satisfied: false,
        category: "İqtisadiyyat",
      },
      {
        id: 56,
        text: "Şifrəniz ən azı 10 fərqli böyük hərf ehtiva etməlidir",
        check: (p) => {
          const upperCount = new Set(p.match(/[A-ZÇĞIİÖŞÜ]/g) || [])
          return upperCount.size >= 10
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 57,
        text: "Şifrəniz Azərbaycan milli geyiminin adını ehtiva etməlidir",
        check: (p) => /çuxa|arxalıq|ləbbadə|papaq|çarıq|kəlagayı|kelagayi/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 58,
        text: "Şifrəniz ən azı 40 simvol olmalıdır",
        check: (p) => p.length >= 40,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 59,
        text: "Şifrəniz Azərbaycan milli quşunun adını ehtiva etməlidir",
        check: (p) => /qartal|şahin|qızılquş|bülbül|göyərçin/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 60,
        text: "Şifrəniz Azərbaycan atalar sözündən bir hissə ehtiva etməlidir (məsələn: 'Su axar, çuxur qalar')",
        check: (p) =>
          /Su axar, çuxur qalar|Ağac bar gətirdikcə başını aşağı əyər|El gücü, sel gücü|Dost dar gündə tanınar|Yüz ölç, bir biç/i.test(
            p,
          ),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 61,
        text: "Şifrəniz Azərbaycan milli ağacının adını ehtiva etməlidir",
        check: (p) => /çinar|palıd|qoz|alma|armud|gilas|ərik/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 62,
        text: "Şifrəniz ən azı 8 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 8
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 63,
        text: "Şifrəniz Azərbaycan milli çiçəyinin adını ehtiva etməlidir",
        check: (p) => /qızılgül|yasəmən|bənövşə|lalə|qərənfil|nərgiz/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 64,
        text: "Şifrəniz ən azı 45 simvol olmalıdır",
        check: (p) => p.length >= 45,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 65,
        text: "Şifrəniz Azərbaycan milli içkisinin adını ehtiva etməlidir",
        check: (p) => /şərbət|ayran|dövğa|kompot|çay|qəhvə/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 66,
        text: "Şifrəniz ən azı 10 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 10
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 67,
        text: "Şifrəniz Azərbaycan milli oyuncağının adını ehtiva etməlidir",
        check: (p) => /kukla|top|uçurtma|zəng|düdük/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 68,
        text: "Şifrəniz ən azı 50 simvol olmalıdır",
        check: (p) => p.length >= 50,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 69,
        text: "Şifrəniz Azərbaycan milli rəmzinin adını ehtiva etməlidir",
        check: (p) => /od|alov|məşəl|ulduz|ay|günəş/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 70,
        text: "Şifrəniz ardıcıl 3 böyük hərf ehtiva etməlidir",
        check: (p) => {
          for (let i = 0; i <= p.length - 3; i++) {
            if (/[A-ZÇĞIİÖŞÜ]{3}/.test(p.substring(i, i + 3))) {
              return true
            }
          }
          return false
        },
        active: false,
        satisfied: false,
        category: "Struktur",
      },
      {
        id: 71,
        text: "Şifrəniz Azərbaycan milli süfrəsinin adını ehtiva etməlidir",
        check: (p) => /xonça|sini|qab|boşqab|çay|şəkər|mürəbbə/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 72,
        text: "Şifrəniz ən azı 12 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 12
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 73,
        text: "Şifrəniz Azərbaycan milli sənətinin adını ehtiva etməlidir",
        check: (p) => /xalçaçılıq|misgərlik|zərgərlik|dulusçuluq|toxuculuq/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 74,
        text: "Şifrəniz ən azı 55 simvol olmalıdır",
        check: (p) => p.length >= 55,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 75,
        text: "Şifrəniz Azərbaycan milli təntənəsinin adını ehtiva etməlidir",
        check: (p) => /toy|nişan|ad günü|mərasim|ziyafət/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 76,
        text: "Şifrəniz ən azı 20 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 20
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 77,
        text: "Şifrəniz Azərbaycan milli mətninin adını ehtiva etməlidir",
        check: (p) => /dastanı|nağıl|əfsanə|rəvayət|hekayə/i.test(p),
        active: false,
        satisfied: false,
        category: "Ədəbiyyat",
      },
      {
        id: 78,
        text: "Şifrəniz ən azı 60 simvol olmalıdır",
        check: (p) => p.length >= 60,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 79,
        text: "Şifrəniz Azərbaycan milli məkanının adını ehtiva etməlidir",
        check: (p) => /ev|məscid|məktəb|bazar|hamam|qəsəbə/i.test(p),
        active: false,
        satisfied: false,
        category: "Memarlıq",
      },
      {
        id: 80,
        text: "Şifrəniz 'Naxçıvan' sözünü ehtiva etməlidir",
        check: (p) => p.includes("Naxçıvan"),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 81,
        text: "Şifrəniz Azərbaycan milli təbiətinin adını ehtiva etməlidir",
        check: (p) => /meşə|çöl|dağ|çay|göl|dəniz|düzənlik/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 82,
        text: "Şifrəniz ən azı 15 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 15
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 83,
        text: "Şifrəniz Azərbaycan milli iqliminin adını ehtiva etməlidir",
        check: (p) => /subtropik|kontinental|dəniz|dağ|çöl|mülayim/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 84,
        text: "Şifrəniz ən azı 65 simvol olmalıdır",
        check: (p) => p.length >= 65,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 85,
        text: "Şifrəniz Azərbaycan milli sərvətinin adını ehtiva etməlidir",
        check: (p) => /neft|qaz|qızıl|gümüş|mis|dəmir|kömür/i.test(p),
        active: false,
        satisfied: false,
        category: "İqtisadiyyat",
      },
      {
        id: 86,
        text: "Şifrəniz ən azı 30 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 30
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 87,
        text: "Şifrəniz Azərbaycan milli sərhədinin adını ehtiva etməlidir",
        check: (p) => /İran|Türkiyə|Rusiya|Ermənistan|Gürcüstan|Xəzər/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 88,
        text: "Şifrəniz ən azı 70 simvol olmalıdır",
        check: (p) => p.length >= 70,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 89,
        text: "Şifrəniz Azərbaycan milli tarixinin adını ehtiva etməlidir",
        check: (p) => /Atropat|Albaniya|Səfəvi|Qacar|Sovet|müstəqillik/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 90,
        text: "Şifrəniz ən azı 20 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 20
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 91,
        text: "Şifrəniz Azərbaycan milli dəyərinin adını ehtiva etməlidir",
        check: (p) => /vətənpərvərlik|qonaqpərvərlik|hörmət|ədəb|namus|şərəf/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 92,
        text: "Şifrəniz ən azı 75 simvol olmalıdır",
        check: (p) => p.length >= 75,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 93,
        text: "Şifrəniz Azərbaycan milli elminin adını ehtiva etməlidir",
        check: (p) => /riyaziyyat|fizika|kimya|biologiya|tarix|coğrafiya|ədəbiyyat/i.test(p),
        active: false,
        satisfied: false,
        category: "Elm",
      },
      {
        id: 94,
        text: "Şifrəniz ən azı 40 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 40
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 95,
        text: "Şifrəniz Azərbaycan milli texnologiyasının adını ehtiva etməlidir",
        check: (p) => /kompüter|internet|mobil|proqram|rəqəmsal|innovasiya/i.test(p),
        active: false,
        satisfied: false,
        category: "Texnologiya",
      },
      {
        id: 96,
        text: "Şifrəniz ən azı 80 simvol olmalıdır",
        check: (p) => p.length >= 80,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 97,
        text: "Şifrəniz Azərbaycan milli gələcəyinin adını ehtiva etməlidir",
        check: (p) => /inkişaf|tərəqqi|modernləşmə|yenilik|innovasiya|gələcək/i.test(p),
        active: false,
        satisfied: false,
        category: "Gələcək",
      },
      {
        id: 98,
        text: "Şifrəniz ən azı 25 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 25
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 99,
        text: "Şifrəniz Azərbaycan milli ümidinin adını ehtiva etməlidir",
        check: (p) => /sülh|dostluq|birlik|həmrəylik|məhəbbət|xoşbəxtlik/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 100,
        text: "Şifrəniz ən azı 85 simvol olmalıdır",
        check: (p) => p.length >= 85,
        active: false,
        satisfied: false,
        category: "Əsas",
      },

      // Çox Çətin qaydalar (101-250)
      {
        id: 101,
        text: "Şifrəniz Azərbaycanın paytaxtının köhnə adını ehtiva etməlidir (məsələn: Bakı)",
        check: (p) => p.includes("Bakı"),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 102,
        text: "Şifrəniz ən azı 3 fərqli rəqəm ehtiva etməlidir",
        check: (p) => new Set(p.match(/\d/g) || []).size >= 3,
        active: false,
        satisfied: false,
        category: "Struktur",
      },
      {
        id: 103,
        text: "Şifrəniz Azərbaycanın ən böyük gölünün adını ehtiva etməlidir",
        check: (p) => p.includes("Xəzər"),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 104,
        text: "Şifrəniz ən azı 90 simvol olmalıdır",
        check: (p) => p.length >= 90,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 105,
        text: "Şifrəniz Azərbaycanın milli qəhrəmanının adını ehtiva etməlidir (məsələn: Mübariz)",
        check: (p) => /Mübariz|Çingiz|Polad|Fərid/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 106,
        text: "Şifrəniz ən azı 50 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 50
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 107,
        text: "Şifrəniz Azərbaycanın ən hündür dağının adını ehtiva etməlidir",
        check: (p) => p.includes("Bazardüzü"),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 108,
        text: "Şifrəniz ən azı 95 simvol olmalıdır",
        check: (p) => p.length >= 95,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 109,
        text: "Şifrəniz Azərbaycanın milli rəqs növünü ehtiva etməlidir",
        check: (p) => /Yallı|Lezginka|Qaytağı|Uzundərə|Ceyrani/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 110,
        text: "Şifrəniz ən azı 30 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 30
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 111,
        text: "Şifrəniz Azərbaycanın milli musiqi alətinin adını ehtiva etməlidir",
        check: (p) => /Tar|Kamança|Ud|Qanun|Nağara|Zurna|Balaban/i.test(p),
        active: false,
        satisfied: false,
        category: "Musiqi",
      },
      {
        id: 112,
        text: "Şifrəniz ən azı 100 simvol olmalıdır",
        check: (p) => p.length >= 100,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 113,
        text: "Şifrəniz Azərbaycanın milli yeməyinin adını ehtiva etməlidir",
        check: (p) => /Plov|Dolma|Kebab|Qutab|Lavangi|Düşbərə|Xəngəl|Bozbaş|Dövğa|Şəkərbura/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 114,
        text: "Şifrəniz ən azı 60 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 60
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 115,
        text: "Şifrəniz Azərbaycanın milli geyiminin adını ehtiva etməlidir",
        check: (p) => /Çuxa|Arxalıq|Ləbbadə|Papaq|Çarıq|Kəlağayı/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 116,
        text: "Şifrəniz ən azı 110 simvol olmalıdır",
        check: (p) => p.length >= 110,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 117,
        text: "Şifrəniz Azərbaycanın milli çiçəyinin adını ehtiva etməlidir",
        check: (p) => /Qızılgül|Yasəmən|Bənövşə|Lalə|Qərənfil|Nərgiz/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 118,
        text: "Şifrəniz ən azı 35 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 35
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 119,
        text: "Şifrəniz Azərbaycanın milli ağacının adını ehtiva etməlidir",
        check: (p) => /Çinar|Palıd|Qoz|Alma|Armud|Gilas|Ərik/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 120,
        text: "Şifrəniz ən azı 120 simvol olmalıdır",
        check: (p) => p.length >= 120,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 121,
        text: "Şifrəniz Azərbaycanın milli quşunun adını ehtiva etməlidir",
        check: (p) => /Qartal|Şahin|Qızılquş|Bülbül|Göyərçin/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 122,
        text: "Şifrəniz ən azı 70 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 70
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 123,
        text: "Şifrəniz Azərbaycanın milli içkisinin adını ehtiva etməlidir",
        check: (p) => /Şərbət|Ayran|Dövğa|Kompot|Çay|Qəhvə/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 124,
        text: "Şifrəniz ən azı 130 simvol olmalıdır",
        check: (p) => p.length >= 130,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 125,
        text: "Şifrəniz Azərbaycanın milli oyuncağının adını ehtiva etməlidir",
        check: (p) => /Kukla|Top|Uçurtma|Zəng|Düdük/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 126,
        text: "Şifrəniz ən azı 40 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 40
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 127,
        text: "Şifrəniz Azərbaycanın milli rəmzinin adını ehtiva etməlidir",
        check: (p) => /Od|Alov|Məşəl|Ulduz|Ay|Günəş/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 128,
        text: "Şifrəniz ən azı 140 simvol olmalıdır",
        check: (p) => p.length >= 140,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 129,
        text: "Şifrəniz Azərbaycanın milli süfrəsinin adını ehtiva etməlidir",
        check: (p) => /Xonça|Sini|Qab|Boşqab|Çay|Şəkər|Mürəbbə/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 130,
        text: "Şifrəniz ən azı 80 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 80
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 131,
        text: "Şifrəniz Azərbaycanın milli sənətinin adını ehtiva etməlidir",
        check: (p) => /Xalçaçılıq|Misgərlik|Zərgərlik|Dulusçuluq|Toxuculuq/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 132,
        text: "Şifrəniz ən azı 150 simvol olmalıdır",
        check: (p) => p.length >= 150,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 133,
        text: "Şifrəniz Azərbaycanın milli təntənəsinin adını ehtiva etməlidir",
        check: (p) => /Toy|Nişan|Ad günü|Mərasim|Ziyafət/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 134,
        text: "Şifrəniz ən azı 45 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 45
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 135,
        text: "Şifrəniz Azərbaycanın milli mətninin adını ehtiva etməlidir",
        check: (p) => /Dastanı|Nağıl|Əfsanə|Rəvayət|Hekayə/i.test(p),
        active: false,
        satisfied: false,
        category: "Ədəbiyyat",
      },
      {
        id: 136,
        text: "Şifrəniz ən azı 160 simvol olmalıdır",
        check: (p) => p.length >= 160,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 137,
        text: "Şifrəniz Azərbaycanın milli məkanının adını ehtiva etməlidir",
        check: (p) => /Ev|Məscid|Məktəb|Bazar|Hamam|Qəsəbə/i.test(p),
        active: false,
        satisfied: false,
        category: "Memarlıq",
      },
      {
        id: 138,
        text: "Şifrəniz ən azı 90 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 90
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 139,
        text: "Şifrəniz Azərbaycanın milli təbiətinin adını ehtiva etməlidir",
        check: (p) => /Meşə|Çöl|Dağ|Çay|Göl|Dəniz|Düzənlik/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 140,
        text: "Şifrəniz ən azı 170 simvol olmalıdır",
        check: (p) => p.length >= 170,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 141,
        text: "Şifrəniz Azərbaycanın milli iqliminin adını ehtiva etməlidir",
        check: (p) => /Subtropik|Kontinental|Dəniz|Dağ|Çöl|Mülayim/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 142,
        text: "Şifrəniz ən azı 50 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 50
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 143,
        text: "Şifrəniz Azərbaycanın milli sərvətinin adını ehtiva etməlidir",
        check: (p) => /Neft|Qaz|Qızıl|Gümüş|Mis|Dəmir|Kömür/i.test(p),
        active: false,
        satisfied: false,
        category: "İqtisadiyyat",
      },
      {
        id: 144,
        text: "Şifrəniz ən azı 180 simvol olmalıdır",
        check: (p) => p.length >= 180,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 145,
        text: "Şifrəniz Azərbaycanın milli sərhədinin adını ehtiva etməlidir",
        check: (p) => /İran|Türkiyə|Rusiya|Ermənistan|Gürcüstan|Xəzər/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 146,
        text: "Şifrəniz ən azı 100 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 100
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 147,
        text: "Şifrəniz Azərbaycanın milli tarixinin adını ehtiva etməlidir",
        check: (p) => /Atropat|Albaniya|Səfəvi|Qacar|Sovet|Müstəqillik/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 148,
        text: "Şifrəniz ən azı 190 simvol olmalıdır",
        check: (p) => p.length >= 190,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 149,
        text: "Şifrəniz Azərbaycanın milli dəyərinin adını ehtiva etməlidir",
        check: (p) => /Vətənpərvərlik|Qonaqpərvərlik|Hörmət|Ədəb|Namus|Şərəf/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 150,
        text: "Şifrəniz ən azı 55 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 55
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 151,
        text: "Şifrəniz Azərbaycanın milli elminin adını ehtiva etməlidir",
        check: (p) => /Riyaziyyat|Fizika|Kimya|Biologiya|Tarix|Coğrafiya|Ədəbiyyat/i.test(p),
        active: false,
        satisfied: false,
        category: "Elm",
      },
      {
        id: 152,
        text: "Şifrəniz ən azı 200 simvol olmalıdır",
        check: (p) => p.length >= 200,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 153,
        text: "Şifrəniz Azərbaycanın milli texnologiyasının adını ehtiva etməlidir",
        check: (p) => /Kompüter|İnternet|Mobil|Proqram|Rəqəmsal|İnnovasiya/i.test(p),
        active: false,
        satisfied: false,
        category: "Texnologiya",
      },
      {
        id: 154,
        text: "Şifrəniz ən azı 110 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 110
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 155,
        text: "Şifrəniz Azərbaycanın milli gələcəyinin adını ehtiva etməlidir",
        check: (p) => /İnkişaf|Tərəqqi|Modernləşmə|Yenilik|İnnovasiya|Gələcək/i.test(p),
        active: false,
        satisfied: false,
        category: "Gələcək",
      },
      {
        id: 156,
        text: "Şifrəniz ən azı 210 simvol olmalıdır",
        check: (p) => p.length >= 210,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 157,
        text: "Şifrəniz Azərbaycanın milli ümidinin adını ehtiva etməlidir",
        check: (p) => /Sülh|Dostluq|Birlik|Həmrəylik|Məhəbbət|Xoşbəxtlik/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 158,
        text: "Şifrəniz ən azı 60 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 60
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 159,
        text: "Şifrəniz Azərbaycanın milli idman növünün adını ehtiva etməlidir",
        check: (p) => /Güləş|Cövkan|Atçılıq|Zorxana/i.test(p),
        active: false,
        satisfied: false,
        category: "İdman",
      },
      {
        id: 160,
        text: "Şifrəniz ən azı 220 simvol olmalıdır",
        check: (p) => p.length >= 220,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 161,
        text: "Şifrəniz Azərbaycanın milli bayrağının rənglərini ehtiva etməlidir (məsələn: mavi, qırmızı, yaşıl)",
        check: (p) => p.includes("mavi") && p.includes("qırmızı") && p.includes("yaşıl"),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 162,
        text: "Şifrəniz ən azı 120 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 120
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 163,
        text: "Şifrəniz Azərbaycanın milli simvolu olan 'Odlar Yurdu' ifadəsini ehtiva etməlidir",
        check: (p) => p.includes("Odlar Yurdu"),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 164,
        text: "Şifrəniz ən azı 230 simvol olmalıdır",
        check: (p) => p.length >= 230,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 165,
        text: "Şifrəniz Azərbaycanın milli musiqi janrının adını ehtiva etməlidir (məsələn: Muğam)",
        check: (p) => /Muğam|Aşıq|Caz|Pop/i.test(p),
        active: false,
        satisfied: false,
        category: "Musiqi",
      },
      {
        id: 166,
        text: "Şifrəniz ən azı 65 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 65
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 167,
        text: "Şifrəniz Azərbaycanın milli rəssamının adını ehtiva etməlidir (məsələn: Səttar Bəhlulzadə)",
        check: (p) => /Səttar Bəhlulzadə|Tahir Salahov|Toğrul Nərimanbəyov/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 168,
        text: "Şifrəniz ən azı 240 simvol olmalıdır",
        check: (p) => p.length >= 240,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 169,
        text: "Şifrəniz Azərbaycanın milli teatrının adını ehtiva etməlidir (məsələn: Milli Dram Teatrı)",
        check: (p) => /Milli Dram Teatrı|Opera və Balet Teatrı|Muskomediya Teatrı/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 170,
        text: "Şifrəniz ən azı 130 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 130
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 171,
        text: "Şifrəniz Azərbaycanın milli kinoteatrının adını ehtiva etməlidir (məsələn: Nizami Kinoteatrı)",
        check: (p) => /Nizami Kinoteatrı|Azərbaycan Kinoteatrı/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 172,
        text: "Şifrəniz ən azı 250 simvol olmalıdır",
        check: (p) => p.length >= 250,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 173,
        text: "Şifrəniz Azərbaycanın milli muzeyinin adını ehtiva etməlidir (məsələn: Milli İncəsənət Muzeyi)",
        check: (p) => /Milli İncəsənət Muzeyi|Tarix Muzeyi|Xalça Muzeyi/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 174,
        text: "Şifrəniz ən azı 70 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 70
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 175,
        text: "Şifrəniz Azərbaycanın milli kitabxanasının adını ehtiva etməlidir (məsələn: Milli Kitabxana)",
        check: (p) => /Milli Kitabxana|Füzuli adına Kitabxana/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 176,
        text: "Şifrəniz ən azı 260 simvol olmalıdır",
        check: (p) => p.length >= 260,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 177,
        text: "Şifrəniz Azərbaycanın milli parkının adını ehtiva etməlidir (məsələn: Göygöl Milli Parkı)",
        check: (p) => /Göygöl Milli Parkı|Şahdağ Milli Parkı|Abşeron Milli Parkı/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 178,
        text: "Şifrəniz ən azı 140 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 140
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 179,
        text: "Şifrəniz Azərbaycanın milli qoruğunun adını ehtiva etməlidir (məsələn: Qobustan Dövlət Tarix-Bədii Qoruğu)",
        check: (p) => /Qobustan|Yanardağ|Atəşgah/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 180,
        text: "Şifrəniz ən azı 270 simvol olmalıdır",
        check: (p) => p.length >= 270,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 181,
        text: "Şifrəniz Azərbaycanın milli memarlıq abidəsinin adını ehtiva etməlidir (məsələn: Möminə Xatun Türbəsi)",
        check: (p) => /Möminə Xatun Türbəsi|Gülüstan Qalası|Xan Sarayı/i.test(p),
        active: false,
        satisfied: false,
        category: "Memarlıq",
      },
      {
        id: 182,
        text: "Şifrəniz ən azı 75 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 75
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 183,
        text: "Şifrəniz Azərbaycanın milli qədim şəhərinin adını ehtiva etməlidir (məsələn: Şəki)",
        check: (p) => /Şəki|Qəbələ|Naxçıvan|Gəncə/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 184,
        text: "Şifrəniz ən azı 280 simvol olmalıdır",
        check: (p) => p.length >= 280,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 185,
        text: "Şifrəniz Azərbaycanın milli qədim dövlətinin adını ehtiva etməlidir (məsələn: Atropatena)",
        check: (p) => /Atropatena|Albaniya|Səfəvilər|Qacarlar/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 186,
        text: "Şifrəniz ən azı 150 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 150
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 187,
        text: "Şifrəniz Azərbaycanın milli qədim sənət növünün adını ehtiva etməlidir (məsələn: Misgərlik)",
        check: (p) => /Misgərlik|Zərgərlik|Dulusçuluq|Xalçaçılıq/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 188,
        text: "Şifrəniz ən azı 290 simvol olmalıdır",
        check: (p) => p.length >= 290,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 189,
        text: "Şifrəniz Azərbaycanın milli qədim musiqi alətinin adını ehtiva etməlidir (məsələn: Tar)",
        check: (p) => /Tar|Kamança|Ud|Qanun|Nağara/i.test(p),
        active: false,
        satisfied: false,
        category: "Musiqi",
      },
      {
        id: 190,
        text: "Şifrəniz ən azı 80 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 80
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 191,
        text: "Şifrəniz Azərbaycanın milli qədim yeməyinin adını ehtiva etməlidir (məsələn: Plov)",
        check: (p) => /Plov|Dolma|Kebab|Qutab|Düşbərə/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 192,
        text: "Şifrəniz ən azı 300 simvol olmalıdır",
        check: (p) => p.length >= 300,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 193,
        text: "Şifrəniz Azərbaycanın milli qədim içkisinin adını ehtiva etməlidir (məsələn: Şərbət)",
        check: (p) => /Şərbət|Ayran|Dövğa|Kompot/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 194,
        text: "Şifrəniz ən azı 160 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 160
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 195,
        text: "Şifrəniz Azərbaycanın milli qədim oyuncağının adını ehtiva etməlidir (məsələn: Kukla)",
        check: (p) => /Kukla|Top|Uçurtma|Zəng/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 196,
        text: "Şifrəniz ən azı 310 simvol olmalıdır",
        check: (p) => p.length >= 310,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 197,
        text: "Şifrəniz Azərbaycanın milli qədim rəmzinin adını ehtiva etməlidir (məsələn: Od)",
        check: (p) => /Od|Alov|Məşəl|Ulduz/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 198,
        text: "Şifrəniz ən azı 85 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 85
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 199,
        text: "Şifrəniz Azərbaycanın milli qədim süfrəsinin adını ehtiva etməlidir (məsələn: Xonça)",
        check: (p) => /Xonça|Sini|Qab|Boşqab/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 200,
        text: "Şifrəniz ən azı 320 simvol olmalıdır",
        check: (p) => p.length >= 320,
        active: false,
        satisfied: false,
        category: "Əsas",
      },

      // Mümkünsüz qaydalar (201-400) - Daha çətin və spesifik qaydalar
      {
        id: 201,
        text: "Şifrəniz Azərbaycanın ən qədim şəhərinin adını ehtiva etməlidir (məsələn: Gəncə)",
        check: (p) => /Gəncə|Naxçıvan|Şəki|Qəbələ/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 202,
        text: "Şifrəniz ən azı 170 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 170
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 203,
        text: "Şifrəniz Azərbaycanın ən uzun çayının adını ehtiva etməlidir",
        check: (p) => p.includes("Kür"),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 204,
        text: "Şifrəniz ən azı 330 simvol olmalıdır",
        check: (p) => p.length >= 330,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 205,
        text: "Şifrəniz Azərbaycanın ən böyük adasının adını ehtiva etməlidir (məsələn: Pirallahı)",
        check: (p) => /Pirallahı|Böyük Zirə|Kiçik Zirə/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 206,
        text: "Şifrəniz ən azı 90 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 90
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 207,
        text: "Şifrəniz Azərbaycanın ən böyük milli parkının adını ehtiva etməlidir (məsələn: Şahdağ Milli Parkı)",
        check: (p) => /Şahdağ Milli Parkı|Göygöl Milli Parkı|Hirkan Milli Parkı/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 208,
        text: "Şifrəniz ən azı 340 simvol olmalıdır",
        check: (p) => p.length >= 340,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 209,
        text: "Şifrəniz Azərbaycanın ən böyük şəlaləsinin adını ehtiva etməlidir (məsələn: Afurca Şəlaləsi)",
        check: (p) => /Afurca Şəlaləsi|Laza Şəlaləsi|Katex Şəlaləsi/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 210,
        text: "Şifrəniz ən azı 180 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 180
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 211,
        text: "Şifrəniz Azərbaycanın ən böyük mağarasının adını ehtiva etməlidir (məsələn: Azıx Mağarası)",
        check: (p) => /Azıx Mağarası|Buzxana Mağarası|Kəpəz Mağarası/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 212,
        text: "Şifrəniz ən azı 350 simvol olmalıdır",
        check: (p) => p.length >= 350,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 213,
        text: "Şifrəniz Azərbaycanın ən böyük vulkanının adını ehtiva etməlidir (məsələn: Torağay)",
        check: (p) => /Torağay|Bozdağ|Qaradağ/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 214,
        text: "Şifrəniz ən azı 95 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 95
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 215,
        text: "Şifrəniz Azərbaycanın ən böyük düzənliyinin adını ehtiva etməlidir (məsələn: Kür-Araz ovalığı)",
        check: (p) => /Kür-Araz ovalığı|Salyan düzü|Muğan düzü/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 216,
        text: "Şifrəniz ən azı 360 simvol olmalıdır",
        check: (p) => p.length >= 360,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 217,
        text: "Şifrəniz Azərbaycanın ən böyük meşəsinin adını ehtiva etməlidir (məsələn: Hirkan meşələri)",
        check: (p) => /Hirkan meşələri|Qəbələ meşələri|İsmayıllı meşələri/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 218,
        text: "Şifrəniz ən azı 190 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 190
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 219,
        text: "Şifrəniz Azərbaycanın ən böyük şəhərinin adını ehtiva etməlidir (məsələn: Bakı)",
        check: (p) => p.includes("Bakı"),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 220,
        text: "Şifrəniz ən azı 370 simvol olmalıdır",
        check: (p) => p.length >= 370,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 221,
        text: "Şifrəniz Azərbaycanın ən böyük kəndinin adını ehtiva etməlidir (məsələn: Xınalıq)",
        check: (p) => /Xınalıq|Lahıc|Basqal/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 222,
        text: "Şifrəniz ən azı 100 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 100
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 223,
        text: "Şifrəniz Azərbaycanın ən böyük adətinin adını ehtiva etməlidir (məsələn: Novruz)",
        check: (p) => /Novruz|Xınayaxdı|Toy|Nişan/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 224,
        text: "Şifrəniz ən azı 380 simvol olmalıdır",
        check: (p) => p.length >= 380,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 225,
        text: "Şifrəniz Azərbaycanın ən böyük tarixi hadisəsinin adını ehtiva etməlidir (məsələn: 20 Yanvar)",
        check: (p) => /20 Yanvar|Qarabağ müharibəsi|Xocalı soyqırımı/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 226,
        text: "Şifrəniz ən azı 200 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 200
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 227,
        text: "Şifrəniz Azərbaycanın ən böyük sənətkarının adını ehtiva etməlidir (məsələn: Üzeyir Hacıbəyov)",
        check: (p) => /Üzeyir Hacıbəyov|Səttar Bəhlulzadə|Tahir Salahov/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 228,
        text: "Şifrəniz ən azı 390 simvol olmalıdır",
        check: (p) => p.length >= 390,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 229,
        text: "Şifrəniz Azərbaycanın ən böyük idmançısının adını ehtiva etməlidir (məsələn: Namiq Abdullayev)",
        check: (p) => /Namiq Abdullayev|Rəsul Çunayev|Hacı Əliyev/i.test(p),
        active: false,
        satisfied: false,
        category: "İdman",
      },
      {
        id: 230,
        text: "Şifrəniz ən azı 105 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 105
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 231,
        text: "Şifrəniz Azərbaycanın ən böyük aliminin adını ehtiva etməlidir (məsələn: Lütfi Zadə)",
        check: (p) => /Lütfi Zadə|Mirzə Fətəli Axundov|Əhməd Cavad/i.test(p),
        active: false,
        satisfied: false,
        category: "Elm",
      },
      {
        id: 232,
        text: "Şifrəniz ən azı 400 simvol olmalıdır",
        check: (p) => p.length >= 400,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 233,
        text: "Şifrəniz Azərbaycanın ən böyük memarının adını ehtiva etməlidir (məsələn: Memar Əcəmi)",
        check: (p) => /Memar Əcəmi|Zivərbəy Əhmədbəyov|Mikayıl Hüseynov/i.test(p),
        active: false,
        satisfied: false,
        category: "Memarlıq",
      },
      {
        id: 234,
        text: "Şifrəniz ən azı 210 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 210
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 235,
        text: "Şifrəniz Azərbaycanın ən böyük yazıçısının adını ehtiva etməlidir (məsələn: Nizami Gəncəvi)",
        check: (p) => /Nizami Gəncəvi|Məhəmməd Füzuli|İmadəddin Nəsimi/i.test(p),
        active: false,
        satisfied: false,
        category: "Ədəbiyyat",
      },
      {
        id: 236,
        text: "Şifrəniz ən azı 410 simvol olmalıdır",
        check: (p) => p.length >= 410,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 237,
        text: "Şifrəniz Azərbaycanın ən böyük şairinin adını ehtiva etməlidir (məsələn: Məhəmməd Füzuli)",
        check: (p) => /Məhəmməd Füzuli|Nizami Gəncəvi|İmadəddin Nəsimi/i.test(p),
        active: false,
        satisfied: false,
        category: "Ədəbiyyat",
      },
      {
        id: 238,
        text: "Şifrəniz ən azı 110 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 110
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 239,
        text: "Şifrəniz Azərbaycanın ən böyük bəstəkarının adını ehtiva etməlidir (məsələn: Üzeyir Hacıbəyov)",
        check: (p) => /Üzeyir Hacıbəyov|Qara Qarayev|Fikrət Əmirov/i.test(p),
        active: false,
        satisfied: false,
        category: "Musiqi",
      },
      {
        id: 240,
        text: "Şifrəniz ən azı 420 simvol olmalıdır",
        check: (p) => p.length >= 420,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 241,
        text: "Şifrəniz Azərbaycanın ən böyük rəqqasının adını ehtiva etməlidir (məsələn: Qəmər Almaszadə)",
        check: (p) => /Qəmər Almaszadə|Leyla Vəkilova|Tamilla Şirəliyeva/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 242,
        text: "Şifrəniz ən azı 220 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 220
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 243,
        text: "Şifrəniz Azərbaycanın ən böyük aktyorunun adını ehtiva etməlidir (məsələn: Həsənağa Turabov)",
        check: (p) => /Həsənağa Turabov|Yaşar Nuri|Siyavuş Aslan/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 244,
        text: "Şifrəniz ən azı 430 simvol olmalıdır",
        check: (p) => p.length >= 430,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 245,
        text: "Şifrəniz Azərbaycanın ən böyük müğənnisinin adını ehtiva etməlidir (məsələn: Rəşid Behbudov)",
        check: (p) => /Rəşid Behbudov|Müslüm Maqomayev|Şövkət Ələkbərova/i.test(p),
        active: false,
        satisfied: false,
        category: "Musiqi",
      },
      {
        id: 246,
        text: "Şifrəniz ən azı 115 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 115
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 247,
        text: "Şifrəniz Azərbaycanın ən böyük rejissorunun adını ehtiva etməlidir (məsələn: Həsən Seyidbəyli)",
        check: (p) => /Həsən Seyidbəyli|Rasim Ocaqov|Eldar Quliyev/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 248,
        text: "Şifrəniz ən azı 440 simvol olmalıdır",
        check: (p) => p.length >= 440,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 249,
        text: "Şifrəniz Azərbaycanın ən böyük heykəltəraşının adını ehtiva etməlidir (məsələn: Fuad Əbdürəhmanov)",
        check: (p) => /Fuad Əbdürəhmanov|Ömər Eldarov|Tokay Məmmədov/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 250,
        text: "Şifrəniz ən azı 230 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 230
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 251,
        text: "Şifrəniz Azərbaycanın ən böyük rəssamının adını ehtiva etməlidir (məsələn: Səttar Bəhlulzadə)",
        check: (p) => /Səttar Bəhlulzadə|Tahir Salahov|Toğrul Nərimanbəyov/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 252,
        text: "Şifrəniz ən azı 450 simvol olmalıdır",
        check: (p) => p.length >= 450,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 253,
        text: "Şifrəniz Azərbaycanın ən böyük xalça növünün adını ehtiva etməlidir (məsələn: Təbriz)",
        check: (p) => /Təbriz|Quba|Şirvan|Qarabağ/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 254,
        text: "Şifrəniz ən azı 120 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 120
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 255,
        text: "Şifrəniz Azərbaycanın ən böyük milli bayramının adını ehtiva etməlidir (məsələn: Novruz)",
        check: (p) => /Novruz|Respublika|Müstəqillik|Qələbə/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 256,
        text: "Şifrəniz ən azı 460 simvol olmalıdır",
        check: (p) => p.length >= 460,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 257,
        text: "Şifrəniz Azərbaycanın ən böyük milli rəqsinin adını ehtiva etməlidir (məsələn: Yallı)",
        check: (p) => /Yallı|Lezginka|Qaytağı|Uzundərə/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 258,
        text: "Şifrəniz ən azı 240 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 240
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 259,
        text: "Şifrəniz Azərbaycanın ən böyük milli geyiminin adını ehtiva etməlidir (məsələn: Çuxa)",
        check: (p) => /Çuxa|Arxalıq|Ləbbadə|Papaq/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 260,
        text: "Şifrəniz ən azı 470 simvol olmalıdır",
        check: (p) => p.length >= 470,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 261,
        text: "Şifrəniz Azərbaycanın ən böyük milli musiqi alətinin adını ehtiva etməlidir (məsələn: Tar)",
        check: (p) => /Tar|Kamança|Ud|Qanun/i.test(p),
        active: false,
        satisfied: false,
        category: "Musiqi",
      },
      {
        id: 262,
        text: "Şifrəniz ən azı 125 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 125
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 263,
        text: "Şifrəniz Azərbaycanın ən böyük milli yeməyinin adını ehtiva etməlidir (məsələn: Plov)",
        check: (p) => /Plov|Dolma|Kebab|Qutab/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 264,
        text: "Şifrəniz ən azı 480 simvol olmalıdır",
        check: (p) => p.length >= 480,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 265,
        text: "Şifrəniz Azərbaycanın ən böyük milli içkisinin adını ehtiva etməlidir (məsələn: Şərbət)",
        check: (p) => /Şərbət|Ayran|Dövğa|Kompot/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 266,
        text: "Şifrəniz ən azı 250 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 250
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 267,
        text: "Şifrəniz Azərbaycanın ən böyük milli oyuncağının adını ehtiva etməlidir (məsələn: Kukla)",
        check: (p) => /Kukla|Top|Uçurtma|Zəng/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 268,
        text: "Şifrəniz ən azı 490 simvol olmalıdır",
        check: (p) => p.length >= 490,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 269,
        text: "Şifrəniz Azərbaycanın ən böyük milli rəmzinin adını ehtiva etməlidir (məsələn: Od)",
        check: (p) => /Od|Alov|Məşəl|Ulduz/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 270,
        text: "Şifrəniz ən azı 130 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 130
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 271,
        text: "Şifrəniz Azərbaycanın ən böyük milli süfrəsinin adını ehtiva etməlidir (məsələn: Xonça)",
        check: (p) => /Xonça|Sini|Qab|Boşqab/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 272,
        text: "Şifrəniz ən azı 500 simvol olmalıdır",
        check: (p) => p.length >= 500,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 273,
        text: "Şifrəniz Azərbaycanın ən böyük milli sənətinin adını ehtiva etməlidir (məsələn: Xalçaçılıq)",
        check: (p) => /Xalçaçılıq|Misgərlik|Zərgərlik|Dulusçuluq/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 274,
        text: "Şifrəniz ən azı 260 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 260
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 275,
        text: "Şifrəniz Azərbaycanın ən böyük milli təntənəsinin adını ehtiva etməlidir (məsələn: Toy)",
        check: (p) => /Toy|Nişan|Ad günü|Mərasim/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 276,
        text: "Şifrəniz ən azı 510 simvol olmalıdır",
        check: (p) => p.length >= 510,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 277,
        text: "Şifrəniz Azərbaycanın ən böyük milli mətninin adını ehtiva etməlidir (məsələn: Dastanı)",
        check: (p) => /Dastanı|Nağıl|Əfsanə|Rəvayət/i.test(p),
        active: false,
        satisfied: false,
        category: "Ədəbiyyat",
      },
      {
        id: 278,
        text: "Şifrəniz ən azı 135 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 135
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 279,
        text: "Şifrəniz Azərbaycanın ən böyük milli məkanının adını ehtiva etməlidir (məsələn: Ev)",
        check: (p) => /Ev|Məscid|Məktəb|Bazar/i.test(p),
        active: false,
        satisfied: false,
        category: "Memarlıq",
      },
      {
        id: 280,
        text: "Şifrəniz ən azı 520 simvol olmalıdır",
        check: (p) => p.length >= 520,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 281,
        text: "Şifrəniz Azərbaycanın ən böyük milli təbiətinin adını ehtiva etməlidir (məsələn: Meşə)",
        check: (p) => /Meşə|Çöl|Dağ|Çay/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 282,
        text: "Şifrəniz ən azı 270 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 270
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 283,
        text: "Şifrəniz Azərbaycanın ən böyük milli iqliminin adını ehtiva etməlidir (məsələn: Subtropik)",
        check: (p) => /Subtropik|Kontinental|Dəniz|Dağ/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 284,
        text: "Şifrəniz ən azı 530 simvol olmalıdır",
        check: (p) => p.length >= 530,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 285,
        text: "Şifrəniz Azərbaycanın ən böyük milli sərvətinin adını ehtiva etməlidir (məsələn: Neft)",
        check: (p) => /Neft|Qaz|Qızıl|Gümüş/i.test(p),
        active: false,
        satisfied: false,
        category: "İqtisadiyyat",
      },
      {
        id: 286,
        text: "Şifrəniz ən azı 140 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 140
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 287,
        text: "Şifrəniz Azərbaycanın ən böyük milli sərhədinin adını ehtiva etməlidir (məsələn: İran)",
        check: (p) => /İran|Türkiyə|Rusiya|Ermənistan/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 288,
        text: "Şifrəniz ən azı 540 simvol olmalıdır",
        check: (p) => p.length >= 540,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 289,
        text: "Şifrəniz Azərbaycanın ən böyük milli tarixinin adını ehtiva etməlidir (məsələn: Atropat)",
        check: (p) => /Atropat|Albaniya|Səfəvi|Qacar/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 290,
        text: "Şifrəniz ən azı 280 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 280
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 291,
        text: "Şifrəniz Azərbaycanın ən böyük milli dəyərinin adını ehtiva etməlidir (məsələn: Vətənpərvərlik)",
        check: (p) => /Vətənpərvərlik|Qonaqpərvərlik|Hörmət|Ədəb/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 292,
        text: "Şifrəniz ən azı 550 simvol olmalıdır",
        check: (p) => p.length >= 550,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 293,
        text: "Şifrəniz Azərbaycanın ən böyük milli elminin adını ehtiva etməlidir (məsələn: Riyaziyyat)",
        check: (p) => /Riyaziyyat|Fizika|Kimya|Biologiya/i.test(p),
        active: false,
        satisfied: false,
        category: "Elm",
      },
      {
        id: 294,
        text: "Şifrəniz ən azı 145 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 145
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 295,
        text: "Şifrəniz Azərbaycanın ən böyük milli texnologiyasının adını ehtiva etməlidir (məsələn: Kompüter)",
        check: (p) => /Kompüter|İnternet|Mobil|Proqram/i.test(p),
        active: false,
        satisfied: false,
        category: "Texnologiya",
      },
      {
        id: 296,
        text: "Şifrəniz ən azı 560 simvol olmalıdır",
        check: (p) => p.length >= 560,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 297,
        text: "Şifrəniz Azərbaycanın ən böyük milli gələcəyinin adını ehtiva etməlidir (məsələn: İnkişaf)",
        check: (p) => /İnkişaf|Tərəqqi|Modernləşmə|Yenilik/i.test(p),
        active: false,
        satisfied: false,
        category: "Gələcək",
      },
      {
        id: 298,
        text: "Şifrəniz ən azı 290 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 290
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 299,
        text: "Şifrəniz Azərbaycanın ən böyük milli ümidinin adını ehtiva etməlidir (məsələn: Sülh)",
        check: (p) => /Sülh|Dostluq|Birlik|Həmrəylik/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 300,
        text: "Şifrəniz ən azı 570 simvol olmalıdır",
        check: (p) => p.length >= 570,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 301,
        text: "Şifrəniz Azərbaycanın ən böyük milli idman növünün adını ehtiva etməlidir (məsələn: Güləş)",
        check: (p) => /Güləş|Cövkan|Atçılıq|Zorxana/i.test(p),
        active: false,
        satisfied: false,
        category: "İdman",
      },
      {
        id: 302,
        text: "Şifrəniz ən azı 150 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 150
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 303,
        text: "Şifrəniz Azərbaycanın milli bayrağının rənglərini ehtiva etməlidir (məsələn: mavi, qırmızı, yaşıl)",
        check: (p) => p.includes("mavi") && p.includes("qırmızı") && p.includes("yaşıl"),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 304,
        text: "Şifrəniz ən azı 580 simvol olmalıdır",
        check: (p) => p.length >= 580,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 305,
        text: "Şifrəniz Azərbaycanın milli simvolu olan 'Odlar Yurdu' ifadəsini ehtiva etməlidir",
        check: (p) => p.includes("Odlar Yurdu"),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 306,
        text: "Şifrəniz ən azı 300 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 300
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 307,
        text: "Şifrəniz Azərbaycanın milli musiqi janrının adını ehtiva etməlidir (məsələn: Muğam)",
        check: (p) => /Muğam|Aşıq|Caz|Pop/i.test(p),
        active: false,
        satisfied: false,
        category: "Musiqi",
      },
      {
        id: 308,
        text: "Şifrəniz ən azı 590 simvol olmalıdır",
        check: (p) => p.length >= 590,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 309,
        text: "Şifrəniz Azərbaycanın milli rəssamının adını ehtiva etməlidir (məsələn: Səttar Bəhlulzadə)",
        check: (p) => /Səttar Bəhlulzadə|Tahir Salahov|Toğrul Nərimanbəyov/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 310,
        text: "Şifrəniz ən azı 155 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 155
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 311,
        text: "Şifrəniz Azərbaycanın milli teatrının adını ehtiva etməlidir (məsələn: Milli Dram Teatrı)",
        check: (p) => /Milli Dram Teatrı|Opera və Balet Teatrı|Muskomediya Teatrı/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 312,
        text: "Şifrəniz ən azı 600 simvol olmalıdır",
        check: (p) => p.length >= 600,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 313,
        text: "Şifrəniz Azərbaycanın milli kinoteatrının adını ehtiva etməlidir (məsələn: Nizami Kinoteatrı)",
        check: (p) => /Nizami Kinoteatrı|Azərbaycan Kinoteatrı/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 314,
        text: "Şifrəniz ən azı 310 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 310
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 315,
        text: "Şifrəniz Azərbaycanın milli muzeyinin adını ehtiva etməlidir (məsələn: Milli İncəsənət Muzeyi)",
        check: (p) => /Milli İncəsənət Muzeyi|Tarix Muzeyi|Xalça Muzeyi/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 316,
        text: "Şifrəniz ən azı 610 simvol olmalıdır",
        check: (p) => p.length >= 610,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 317,
        text: "Şifrəniz Azərbaycanın milli kitabxanasının adını ehtiva etməlidir (məsələn: Milli Kitabxana)",
        check: (p) => /Milli Kitabxana|Füzuli adına Kitabxana/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 318,
        text: "Şifrəniz ən azı 160 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 160
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 319,
        text: "Şifrəniz Azərbaycanın milli parkının adını ehtiva etməlidir (məsələn: Göygöl Milli Parkı)",
        check: (p) => /Göygöl Milli Parkı|Şahdağ Milli Parkı|Abşeron Milli Parkı/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 320,
        text: "Şifrəniz ən azı 620 simvol olmalıdır",
        check: (p) => p.length >= 620,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 321,
        text: "Şifrəniz Azərbaycanın milli qoruğunun adını ehtiva etməlidir (məsələn: Qobustan Dövlət Tarix-Bədii Qoruğu)",
        check: (p) => /Qobustan|Yanardağ|Atəşgah/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 322,
        text: "Şifrəniz ən azı 320 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 320
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 323,
        text: "Şifrəniz Azərbaycanın milli memarlıq abidəsinin adını ehtiva etməlidir (məsələn: Möminə Xatun Türbəsi)",
        check: (p) => /Möminə Xatun Türbəsi|Gülüstan Qalası|Xan Sarayı/i.test(p),
        active: false,
        satisfied: false,
        category: "Memarlıq",
      },
      {
        id: 324,
        text: "Şifrəniz ən azı 630 simvol olmalıdır",
        check: (p) => p.length >= 630,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 325,
        text: "Şifrəniz Azərbaycanın milli qədim şəhərinin adını ehtiva etməlidir (məsələn: Şəki)",
        check: (p) => /Şəki|Qəbələ|Naxçıvan|Gəncə/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 326,
        text: "Şifrəniz ən azı 165 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 165
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 327,
        text: "Şifrəniz Azərbaycanın milli qədim dövlətinin adını ehtiva etməlidir (məsələn: Atropatena)",
        check: (p) => /Atropatena|Albaniya|Səfəvilər|Qacarlar/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 328,
        text: "Şifrəniz ən azı 640 simvol olmalıdır",
        check: (p) => p.length >= 640,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 329,
        text: "Şifrəniz Azərbaycanın milli qədim sənət növünün adını ehtiva etməlidir (məsələn: Misgərlik)",
        check: (p) => /Misgərlik|Zərgərlik|Dulusçuluq|Xalçaçılıq/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 330,
        text: "Şifrəniz ən azı 330 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 330
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 331,
        text: "Şifrəniz Azərbaycanın milli qədim musiqi alətinin adını ehtiva etməlidir (məsələn: Tar)",
        check: (p) => /Tar|Kamança|Ud|Qanun|Nağara/i.test(p),
        active: false,
        satisfied: false,
        category: "Musiqi",
      },
      {
        id: 332,
        text: "Şifrəniz ən azı 650 simvol olmalıdır",
        check: (p) => p.length >= 650,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 333,
        text: "Şifrəniz Azərbaycanın milli qədim yeməyinin adını ehtiva etməlidir (məsələn: Plov)",
        check: (p) => /Plov|Dolma|Kebab|Qutab|Düşbərə/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 334,
        text: "Şifrəniz ən azı 170 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 170
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 335,
        text: "Şifrəniz Azərbaycanın milli qədim içkisinin adını ehtiva etməlidir (məsələn: Şərbət)",
        check: (p) => /Şərbət|Ayran|Dövğa|Kompot/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 336,
        text: "Şifrəniz ən azı 660 simvol olmalıdır",
        check: (p) => p.length >= 660,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 337,
        text: "Şifrəniz Azərbaycanın milli qədim oyuncağının adını ehtiva etməlidir (məsələn: Kukla)",
        check: (p) => /Kukla|Top|Uçurtma|Zəng/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 338,
        text: "Şifrəniz ən azı 340 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 340
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 339,
        text: "Şifrəniz Azərbaycanın milli qədim rəmzinin adını ehtiva etməlidir (məsələn: Od)",
        check: (p) => /Od|Alov|Məşəl|Ulduz/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 340,
        text: "Şifrəniz ən azı 670 simvol olmalıdır",
        check: (p) => p.length >= 670,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 341,
        text: "Şifrəniz Azərbaycanın milli qədim süfrəsinin adını ehtiva etməlidir (məsələn: Xonça)",
        check: (p) => /Xonça|Sini|Qab|Boşqab/i.test(p),
        active: false,
        satisfied: false,
        category: "Mətbəx",
      },
      {
        id: 342,
        text: "Şifrəniz ən azı 175 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 175
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 343,
        text: "Şifrəniz Azərbaycanın ən böyük milli sənətinin adını ehtiva etməlidir (məsələn: Xalçaçılıq)",
        check: (p) => /Xalçaçılıq|Misgərlik|Zərgərlik|Dulusçuluq/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 344,
        text: "Şifrəniz ən azı 680 simvol olmalıdır",
        check: (p) => p.length >= 680,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 345,
        text: "Şifrəniz Azərbaycanın ən böyük milli təntənəsinin adını ehtiva etməlidir (məsələn: Toy)",
        check: (p) => /Toy|Nişan|Ad günü|Mərasim/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 346,
        text: "Şifrəniz ən azı 350 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 350
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 347,
        text: "Şifrəniz Azərbaycanın ən böyük milli mətninin adını ehtiva etməlidir (məsələn: Dastanı)",
        check: (p) => /Dastanı|Nağıl|Əfsanə|Rəvayət/i.test(p),
        active: false,
        satisfied: false,
        category: "Ədəbiyyat",
      },
      {
        id: 348,
        text: "Şifrəniz ən azı 690 simvol olmalıdır",
        check: (p) => p.length >= 690,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 349,
        text: "Şifrəniz Azərbaycanın ən böyük milli məkanının adını ehtiva etməlidir (məsələn: Ev)",
        check: (p) => /Ev|Məscid|Məktəb|Bazar/i.test(p),
        active: false,
        satisfied: false,
        category: "Memarlıq",
      },
      {
        id: 350,
        text: "Şifrəniz ən azı 180 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 180
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 351,
        text: "Şifrəniz Azərbaycanın ən böyük milli təbiətinin adını ehtiva etməlidir (məsələn: Meşə)",
        check: (p) => /Meşə|Çöl|Dağ|Çay/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 352,
        text: "Şifrəniz ən azı 700 simvol olmalıdır",
        check: (p) => p.length >= 700,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 353,
        text: "Şifrəniz Azərbaycanın ən böyük milli iqliminin adını ehtiva etməlidir (məsələn: Subtropik)",
        check: (p) => /Subtropik|Kontinental|Dəniz|Dağ/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 354,
        text: "Şifrəniz ən azı 360 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 360
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 355,
        text: "Şifrəniz Azərbaycanın ən böyük milli sərvətinin adını ehtiva etməlidir (məsələn: Neft)",
        check: (p) => /Neft|Qaz|Qızıl|Gümüş/i.test(p),
        active: false,
        satisfied: false,
        category: "İqtisadiyyat",
      },
      {
        id: 356,
        text: "Şifrəniz ən azı 710 simvol olmalıdır",
        check: (p) => p.length >= 710,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 357,
        text: "Şifrəniz Azərbaycanın ən böyük milli sərhədinin adını ehtiva etməlidir (məsələn: İran)",
        check: (p) => /İran|Türkiyə|Rusiya|Ermənistan/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 358,
        text: "Şifrəniz ən azı 185 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 185
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 359,
        text: "Şifrəniz Azərbaycanın ən böyük milli tarixinin adını ehtiva etməlidir (məsələn: Atropat)",
        check: (p) => /Atropat|Albaniya|Səfəvi|Qacar/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 360,
        text: "Şifrəniz ən azı 720 simvol olmalıdır",
        check: (p) => p.length >= 720,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 361,
        text: "Şifrəniz Azərbaycanın ən böyük milli dəyərinin adını ehtiva etməlidir (məsələn: Vətənpərvərlik)",
        check: (p) => /Vətənpərvərlik|Qonaqpərvərlik|Hörmət|Ədəb/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 362,
        text: "Şifrəniz ən azı 370 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 370
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 363,
        text: "Şifrəniz Azərbaycanın ən böyük milli elminin adını ehtiva etməlidir (məsələn: Riyaziyyat)",
        check: (p) => /Riyaziyyat|Fizika|Kimya|Biologiya/i.test(p),
        active: false,
        satisfied: false,
        category: "Elm",
      },
      {
        id: 364,
        text: "Şifrəniz ən azı 730 simvol olmalıdır",
        check: (p) => p.length >= 730,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 365,
        text: "Şifrəniz Azərbaycanın ən böyük milli texnologiyasının adını ehtiva etməlidir (məsələn: Kompüter)",
        check: (p) => /Kompüter|İnternet|Mobil|Proqram/i.test(p),
        active: false,
        satisfied: false,
        category: "Texnologiya",
      },
      {
        id: 366,
        text: "Şifrəniz ən azı 190 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 190
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 367,
        text: "Şifrəniz Azərbaycanın ən böyük milli gələcəyinin adını ehtiva etməlidir (məsələn: İnkişaf)",
        check: (p) => /İnkişaf|Tərəqqi|Modernləşmə|Yenilik/i.test(p),
        active: false,
        satisfied: false,
        category: "Gələcək",
      },
      {
        id: 368,
        text: "Şifrəniz ən azı 740 simvol olmalıdır",
        check: (p) => p.length >= 740,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 369,
        text: "Şifrəniz Azərbaycanın ən böyük milli ümidinin adını ehtiva etməlidir (məsələn: Sülh)",
        check: (p) => /Sülh|Dostluq|Birlik|Həmrəylik/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 370,
        text: "Şifrəniz ən azı 380 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 380
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 371,
        text: "Şifrəniz Azərbaycanın ən böyük milli idman növünün adını ehtiva etməlidir (məsələn: Güləş)",
        check: (p) => /Güləş|Cövkan|Atçılıq|Zorxana/i.test(p),
        active: false,
        satisfied: false,
        category: "İdman",
      },
      {
        id: 372,
        text: "Şifrəniz ən azı 750 simvol olmalıdır",
        check: (p) => p.length >= 750,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 373,
        text: "Şifrəniz Azərbaycanın milli bayrağının rənglərini ehtiva etməlidir (məsələn: mavi, qırmızı, yaşıl)",
        check: (p) => p.includes("mavi") && p.includes("qırmızı") && p.includes("yaşıl"),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 374,
        text: "Şifrəniz ən azı 195 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 195
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 375,
        text: "Şifrəniz Azərbaycanın milli simvolu olan 'Odlar Yurdu' ifadəsini ehtiva etməlidir",
        check: (p) => p.includes("Odlar Yurdu"),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 376,
        text: "Şifrəniz ən azı 760 simvol olmalıdır",
        check: (p) => p.length >= 760,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 377,
        text: "Şifrəniz Azərbaycanın milli musiqi janrının adını ehtiva etməlidir (məsələn: Muğam)",
        check: (p) => /Muğam|Aşıq|Caz|Pop/i.test(p),
        active: false,
        satisfied: false,
        category: "Musiqi",
      },
      {
        id: 378,
        text: "Şifrəniz ən azı 390 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 390
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 379,
        text: "Şifrəniz Azərbaycanın milli rəssamının adını ehtiva etməlidir (məsələn: Səttar Bəhlulzadə)",
        check: (p) => /Səttar Bəhlulzadə|Tahir Salahov|Toğrul Nərimanbəyov/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 380,
        text: "Şifrəniz ən azı 770 simvol olmalıdır",
        check: (p) => p.length >= 770,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 381,
        text: "Şifrəniz Azərbaycanın milli teatrının adını ehtiva etməlidir (məsələn: Milli Dram Teatrı)",
        check: (p) => /Milli Dram Teatrı|Opera və Balet Teatrı|Muskomediya Teatrı/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 382,
        text: "Şifrəniz ən azı 200 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 200
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 383,
        text: "Şifrəniz Azərbaycanın milli kinoteatrının adını ehtiva etməlidir (məsələn: Nizami Kinoteatrı)",
        check: (p) => /Nizami Kinoteatrı|Azərbaycan Kinoteatrı/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 384,
        text: "Şifrəniz ən azı 780 simvol olmalıdır",
        check: (p) => p.length >= 780,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 385,
        text: "Şifrəniz Azərbaycanın milli muzeyinin adını ehtiva etməlidir (məsələn: Milli İncəsənət Muzeyi)",
        check: (p) => /Milli İncəsənət Muzeyi|Tarix Muzeyi|Xalça Muzeyi/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 386,
        text: "Şifrəniz ən azı 400 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 400
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 387,
        text: "Şifrəniz Azərbaycanın milli kitabxanasının adını ehtiva etməlidir (məsələn: Milli Kitabxana)",
        check: (p) => /Milli Kitabxana|Füzuli adına Kitabxana/i.test(p),
        active: false,
        satisfied: false,
        category: "Mədəniyyət",
      },
      {
        id: 388,
        text: "Şifrəniz ən azı 790 simvol olmalıdır",
        check: (p) => p.length >= 790,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 389,
        text: "Şifrəniz Azərbaycanın milli parkının adını ehtiva etməlidir (məsələn: Göygöl Milli Parkı)",
        check: (p) => /Göygöl Milli Parkı|Şahdağ Milli Parkı|Abşeron Milli Parkı/i.test(p),
        active: false,
        satisfied: false,
        category: "Təbiət",
      },
      {
        id: 390,
        text: "Şifrəniz ən azı 205 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 205
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 391,
        text: "Şifrəniz Azərbaycanın milli qoruğunun adını ehtiva etməlidir (məsələn: Qobustan Dövlət Tarix-Bədii Qoruğu)",
        check: (p) => /Qobustan|Yanardağ|Atəşgah/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 392,
        text: "Şifrəniz ən azı 800 simvol olmalıdır",
        check: (p) => p.length >= 800,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 393,
        text: "Şifrəniz Azərbaycanın milli memarlıq abidəsinin adını ehtiva etməlidir (məsələn: Möminə Xatun Türbəsi)",
        check: (p) => /Möminə Xatun Türbəsi|Gülüstan Qalası|Xan Sarayı/i.test(p),
        active: false,
        satisfied: false,
        category: "Memarlıq",
      },
      {
        id: 394,
        text: "Şifrəniz ən azı 410 emoji ehtiva etməlidir",
        check: (p) => {
          const emojiCount = (
            p.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []
          ).length
          return emojiCount >= 410
        },
        active: false,
        satisfied: false,
        category: "Müasir",
      },
      {
        id: 395,
        text: "Şifrəniz Azərbaycanın milli qədim şəhərinin adını ehtiva etməlidir (məsələn: Şəki)",
        check: (p) => /Şəki|Qəbələ|Naxçıvan|Gəncə/i.test(p),
        active: false,
        satisfied: false,
        category: "Coğrafiya",
      },
      {
        id: 396,
        text: "Şifrəniz ən azı 810 simvol olmalıdır",
        check: (p) => p.length >= 810,
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 397,
        text: "Şifrəniz Azərbaycanın milli qədim dövlətinin adını ehtiva etməlidir (məsələn: Atropatena)",
        check: (p) => /Atropatena|Albaniya|Səfəvilər|Qacarlar/i.test(p),
        active: false,
        satisfied: false,
        category: "Tarix",
      },
      {
        id: 398,
        text: "Şifrəniz ən azı 210 xüsusi simvol ehtiva etməlidir",
        check: (p) => {
          const specialCount = (p.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g) || []).length
          return specialCount >= 210
        },
        active: false,
        satisfied: false,
        category: "Əsas",
      },
      {
        id: 399,
        text: "Şifrəniz Azərbaycanın milli qədim sənət növünün adını ehtiva etməlidir (məsələn: Misgərlik)",
        check: (p) => /Misgərlik|Zərgərlik|Dulusçuluq|Xalçaçılıq/i.test(p),
        active: false,
        satisfied: false,
        category: "Sənət",
      },
      {
        id: 400,
        text: "Təbriklər! Siz bütün qaydaları yerinə yetirdiniz! 🎉🎊🏆",
        check: (p) => true,
        active: false,
        satisfied: false,
        category: "Qələbə",
      },
    ],
    [currentTime],
  )

  const activeRules = useMemo(() => {
    const updatedRules = [...rules]
    let allSatisfied = true

    for (let i = 0; i < updatedRules.length; i++) {
      const rule = updatedRules[i]

      if (i === 0) {
        rule.active = true
      } else {
        rule.active = updatedRules[i - 1].satisfied
      }

      if (rule.active) {
        rule.satisfied = rule.check(password)
        if (!rule.satisfied) {
          allSatisfied = false
        }
      } else {
        rule.satisfied = false
        allSatisfied = false
      }
    }

    return updatedRules
  }, [password, rules])

  const completedRulesCount = activeRules.filter((rule) => rule.satisfied).length
  const totalActiveRules = activeRules.filter((rule) => rule.active).length

  // Animasiya effektləri
  useEffect(() => {
    const currentActiveRules = activeRules.filter((rule) => rule.active && !rule.satisfied)
    const currentCompletedRules = activeRules.filter((rule) => rule.satisfied)

    // Yeni tamamlanan qayda üçün animasiya
    const lastCompletedRule = currentCompletedRules[currentCompletedRules.length - 1]
    if (lastCompletedRule && completedRuleId !== lastCompletedRule.id) {
      setCompletedRuleId(lastCompletedRule.id)
      setTimeout(() => setCompletedRuleId(null), 500)
    }

    // Yeni aktiv qayda üçün animasiya
    const firstActiveRule = currentActiveRules[0]
    if (firstActiveRule && newRuleId !== firstActiveRule.id) {
      setNewRuleId(firstActiveRule.id)
      setTimeout(() => setNewRuleId(null), 500)
    }
  }, [activeRules.map((rule) => `${rule.id}-${rule.active}-${rule.satisfied}`).join(",")])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.includes("@") && email.includes(".")) {
      setIsEmailSubmitted(true)
    } else {
      toast({
        title: "Xəta",
        description: "Zəhmət olmasa, etibarlı bir email ünvanı daxil edin.",
        variant: "destructive",
      })
    }
  }

  const handleShareScore = async () => {
    const shareText = `Mən "Qeydiyyatdan Keç" oyununda ${completedRulesCount} qaydanı tamamladım! Sən də cəhd et! #QeydiyyatdanKeçOyunu #ŞifrəOyunu`

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareText)
        toast({
          title: "Uğurlu!",
          description: "Paylaşım mətni panoya kopyalandı. İndi istədiyin yerdə paylaşa bilərsən!",
        })
      } catch (err) {
        console.error("Panoya kopyalamaq alınmadı:", err)
        toast({
          title: "Xəta",
          description: "Paylaşım mətni panoya kopyalana bilmədi. Zəhmət olmasa, əl ilə kopyalayın.",
          variant: "destructive",
        })
      }
    } else {
      // Fallback for browsers that don't support navigator.clipboard
      const textArea = document.createElement("textarea")
      textArea.value = shareText
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand("copy")
        toast({
          title: "Uğurlu!",
          description: "Paylaşım mətni panoya kopyalandı. İndi istədiyin yerdə paylaşa bilərsən!",
        })
      } catch (err) {
        console.error("Panoya kopyalamaq alınmadı:", err)
        toast({
          title: "Xəta",
          description: "Paylaşım mətni panoya kopyalana bilmədi. Zəhmət olmasa, əl ilə kopyalayın.",
          variant: "destructive",
        })
      }
      document.body.removeChild(textArea)
    }
  }

  if (!isEmailSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-2 sm:p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl sm:text-3xl font-bold text-gray-800">Qeydiyyatdan Keç</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email ünvanınız
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="text-lg p-4 min-h-[50px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full text-lg py-3">
                Davam et
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">🔐 Qeydiyyatdan Keç</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Azərbaycan dilində şifrə yaradın və bütün qaydaları yerinə yetirin!
          </p>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>Şifrənizi daxil edin</span>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="outline">Uzunluq: {password.length}</Badge>
                <Badge variant="secondary">Aktiv: {totalActiveRules}</Badge>
                <Badge variant={completedRulesCount === 400 ? "default" : "destructive"}>
                  Yerinə yetirilmiş: {completedRulesCount}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrənizi buraya yazın..."
              className="text-lg p-4 min-h-[60px]"
              style={{ fontSize: "16px" }}
            />
            {completedRulesCount >= 3 && completedRulesCount < 400 && (
              <div className="mt-4 text-center">
                <Button onClick={handleShareScore} className="w-full sm:w-auto">
                  <Share2 className="mr-2 h-4 w-4" /> Yeni skorumu paylaş
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3 max-h-[500px] overflow-y-auto mt-4">
          {activeRules
            .filter((rule) => rule.active || rule.satisfied)
            .sort((a, b) => {
              // Aktiv amma yerinə yetirilməmiş qaydalar yuxarıda
              if (a.active && !a.satisfied && b.satisfied) return -1
              if (b.active && !b.satisfied && a.satisfied) return 1
              // Qalanlar ID-yə görə
              return a.id - b.id
            })
            .map((rule) => (
              <Card
                key={rule.id}
                className={`transition-all duration-500 ${
                  rule.satisfied
                    ? "border-green-500 bg-green-50"
                    : rule.active
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-gray-50"
                } ${completedRuleId === rule.id ? "animate-slide-down" : ""} ${
                  newRuleId === rule.id && rule.active && !rule.satisfied ? "animate-slide-in-right" : ""
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {rule.satisfied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : rule.active ? (
                        <X className="h-4 w-4 text-red-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">Qayda {rule.id}</span>
                        <Badge variant="outline" className="text-xs">
                          {rule.category}
                        </Badge>
                      </div>
                      <p
                        className={`text-sm leading-relaxed ${
                          rule.satisfied ? "text-green-800" : rule.active ? "text-red-800" : "text-gray-600"
                        }`}
                      >
                        {rule.text}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {completedRulesCount === 400 && (
          <Card className="mt-6 border-yellow-500 bg-yellow-50">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-yellow-800 mb-2">Təbriklər!</h2>
              <p className="text-yellow-700">Siz bütün qaydaları yerinə yetirdiniz və qeydiyyatı tamamladınız!</p>
              <div className="mt-4 text-sm text-yellow-600">Şifrənizin son uzunluğu: {password.length} simvol</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
