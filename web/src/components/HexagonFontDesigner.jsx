import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Slider } from "../components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Save, Download, Trash2, Upload, ChevronUp, ChevronDown } from "lucide-react";

const HexagonFontDesigner = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?-:;()/ ".split("");
  const DEFAULT_FONT_HASH = "UDoxMTExMDExMDExMTAxMDAxMDA7QTowMDEwMTEwMTExMDExMTExMDE7SDoxMDExMDEwMTExMDExMDExMDE7RToxMTExMDAxMTAxMDAxMDAxMTE7TDoxMDAxMDAxMDAxMDAxMDAxMTE7TzowMTExMDExMDExMDExMDExMTA7VzoxMDExMDExMDExMDExMTExMDE7UjoxMTExMDExMTExMTAxMDExMDE7RDoxMTExMDExMDExMDExMDExMTA7IDowMDAwMDAwMDAwMDAwMDAwMDA=";
  const DEFAULT_FIRST_CHAR = "P";
  const DEFAULT_MESSAGE = "HELLO WORLD!";

  const [grid, setGrid] = useState(
    Array(6)
      .fill()
      .map(() => Array(4).fill(false))
  );
  const [currentLetter, setCurrentLetter] = useState(DEFAULT_FIRST_CHAR);
  const [previewText, setPreviewText] = useState(DEFAULT_MESSAGE);
  const [previewSize, setPreviewSize] = useState(0.5);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(null);
  const [fontData, setFontData] = useState(() => {
    try {
      loadFontFromHash(DEFAULT_FONT_HASH);
    } catch {
      return {};
    }
  });
  const [isGridViewCollapsed, setIsGridViewCollapsed] = useState(false);
  const [gridViewScale, setGridViewScale] = useState(0.5);

  const baseHexSize = 20;
  const hexSize = baseHexSize;
  const hexWidth = Math.sqrt(3) * hexSize;
  const hexHeight = 2 * hexSize;
  const horizontalSpacing = hexWidth;
  const verticalSpacing = hexHeight * 0.75;

  const getHexagonPoints = (x, y) => {
    const angles = Array(6)
      .fill()
      .map((_, i) => (Math.PI / 3) * i - Math.PI / 6);
    return angles
      .map((angle) => [
        x + hexSize * Math.cos(angle),
        y + hexSize * Math.sin(angle),
      ])
      .map((point) => point.join(","))
      .join(" ");
  };

  const toggleHexagon = (row, col, value) => {
    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = value ?? !newGrid[row][col];
    setGrid(newGrid);
  };

  const handleCharacterInput = (e) => {
    const value = e.target.value.toUpperCase();
    if (value.length === 1) {
      setCurrentLetter(value);
      setDropdownOpen(false);
    }
  };

  const saveLetter = () => {
    setFontData((prev) => ({
      ...prev,
      [currentLetter]: [...grid],
    }));
  };

  const loadLetter = (letter) => {
    if (fontData[letter]) {
      setGrid(fontData[letter]);
    } else {
      setGrid(
        Array(6)
          .fill()
          .map(() => Array(4).fill(false))
      );
    }
    setCurrentLetter(letter);
  };

  const clearGrid = () => {
    setGrid(
      Array(6)
        .fill()
        .map(() => Array(4).fill(false))
    );
  };

  const getFontHash = () => {
    // Convert each letter's grid into a single number (18 bits per letter)
    const binaryStrings = Object.entries(fontData).map(([letter, grid]) => {
      let value = 0;
      // Flatten grid and convert to single number
      grid.flat().forEach((cell, index) => {
        if (cell) {
          value |= (1 << index);
        }
      });
      return `${letter}${value.toString(36)}`; // Use base36 for numbers
    });
    
    // Join all letters with a minimal separator
    return binaryStrings.join(',');
  };
  
  const loadFontFromHash = (hash) => {
    try {
      const letterDefs = hash.split(',');
      const newFontData = {};
  
      letterDefs.forEach((def) => {
        const letter = def[0];
        const value = parseInt(def.slice(1), 36);
        
        if (letter && !isNaN(value)) {
          const gridData = Array(6)
            .fill()
            .map(() => Array(4).fill(false));
            
          // Extract bits back into grid
          for (let i = 0; i < 24; i++) {
            const row = Math.floor(i / 3);
            const col = i % 4;
            gridData[row][col] = ((value >> i) & 1) === 1;
          }
          newFontData[letter] = gridData;
        }
      });
  
      setFontData(newFontData);
      return true;
    } catch (error) {
      console.error("Invalid font hash:", error);
      return false;
    }
  };
  const svgWidth = horizontalSpacing * 4 + hexWidth / 2;
  const svgHeight = verticalSpacing * 6 + hexHeight / 4;

  // Update HexagonGrid component
  const HexagonGrid = ({
    interactive = true,
    letterGrid = grid,
    scale = 1,
  }) => {
    const handleMouseDown = (e, row, col) => {
      if (!interactive) return;
      const newValue = e.buttons === 2 ? false : !grid[row][col];
      setDragValue(newValue);
      setIsDragging(true);
      toggleHexagon(row, col, newValue);
      e.preventDefault(); // Prevent default right-click menu
    };

    const handleMouseOver = (row, col) => {
      if (!interactive || !isDragging) return;
      toggleHexagon(row, col, dragValue);
    };

    return (
      <svg
        width={svgWidth * scale}
        height={svgHeight * scale}
        className={interactive ? "bg-gray-100 rounded" : ""}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onContextMenu={(e) => e.preventDefault()}
      >
        {letterGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const x =
              colIndex * horizontalSpacing +
              (rowIndex % 2 ? horizontalSpacing / 2 : 0) +
              hexWidth / 2;
            const y = rowIndex * verticalSpacing + hexHeight / 2;

            return (
              <polygon
                key={`${rowIndex}-${colIndex}`}
                points={getHexagonPoints(x, y)}
                fill={cell ? "#2563eb" : interactive ? "white" : "transparent"}
                stroke={interactive ? "#cbd5e1" : "none"}
                strokeWidth="1"
                onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                className={
                  interactive
                    ? "cursor-pointer hover:stroke-blue-400 transition-colors"
                    : ""
                }
              />
            );
          })
        )}
      </svg>
    );
  };

  const CharacterCell = ({ char, onSelect }) => {
    const letterGrid = fontData[char] || Array(6).fill().map(() => Array(4).fill(false));
    
    return (
      <div className="flex flex-col items-center p-2 border rounded hover:border-blue-500">
        <div className="text-sm font-medium mb-1">{char}</div>
        <div 
          onClick={() => onSelect(char)}
          className="cursor-pointer"
        >
          <HexagonGrid 
            interactive={false} 
            letterGrid={letterGrid} 
            scale={gridViewScale}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Design Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-24 justify-between">
                    {currentLetter}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-100 p-0"
                  side="bottom"
                  align="start"
                >
                  <div className="grid grid-cols-6 gap-1 p-2">
                    {characters.map((char) => (
                      <button
                        key={char}
                        className={`h-8 rounded hover:bg-gray-100 flex items-center justify-center ${
                          currentLetter === char ? "bg-blue-100" : ""
                        }`}
                        onClick={() => {
                          setCurrentLetter(char);
                          setDropdownOpen(false);
                        }}
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                  <div className="border-t p-2">
                    <Input
                      type="text"
                      placeholder="Type a character"
                      maxLength={1}
                      onChange={handleCharacterInput}
                      className="w-full"
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <Button onClick={saveLetter}>
                <Save className="w-4 h-4 mr-2" />
                Save Letter
              </Button>
              <Button onClick={clearGrid} variant="outline">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            <HexagonGrid />

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Font Hash</h3>
                <div className="flex gap-2">
                  <Input
                    value={
                      Object.keys(fontData).length > 0 ? getFontHash() : ""
                    }
                    readOnly
                    placeholder="Design letters to generate hash..."
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const hash = getFontHash();
                      navigator.clipboard.writeText(hash);
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Load Font</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste font hash here..."
                    onChange={(e) => loadFontFromHash(e.target.value)}
                  />
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Load
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value.toUpperCase())}
              className="mb-4"
              placeholder="Enter preview text"
            />

            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                Preview Size
              </label>
              <Slider
                value={[previewSize]}
                onValueChange={([value]) => setPreviewSize(value)}
                min={0.1}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
              {Object.keys(fontData).map((letter) => (
                <Button
                  key={letter}
                  onClick={() => loadLetter(letter)}
                  variant={currentLetter === letter ? "default" : "outline"}
                  className="w-10 h-10"
                >
                  {letter}
                </Button>
              ))}
            </div>

            <div className="p-4 bg-gray-100 rounded overflow-x-auto whitespace-nowrap">
              {previewText.split("").map((letter, index) => {
                if (!fontData[letter])
                  return (
                    <span key={index} className="text-gray-400 mx-1">
                      □
                    </span>
                  );
                return (
                  <div key={index} className="inline-block mx-1">
                    <HexagonGrid
                      interactive={false}
                      letterGrid={fontData[letter]}
                      scale={previewSize}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">All Characters</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Grid Size</span>
              <Slider
                value={[gridViewScale]}
                onValueChange={([value]) => setGridViewScale(value)}
                min={0.3}
                max={1}
                step={0.1}
                className="w-32"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setIsGridViewCollapsed(!isGridViewCollapsed)}
            >
              {isGridViewCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {!isGridViewCollapsed && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                {characters.map((char) => (
                  <CharacterCell
                    key={char}
                    char={char}
                    onSelect={(selectedChar) => {
                      setCurrentLetter(selectedChar);
                      if (fontData[selectedChar]) {
                        setGrid(fontData[selectedChar]);
                      } else {
                        clearGrid();
                      }
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HexagonFontDesigner;
