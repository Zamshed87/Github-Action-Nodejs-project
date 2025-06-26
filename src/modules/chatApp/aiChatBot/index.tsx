"use client";

import {
  SmartToy as BotIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Paper,
  Slide,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import MarkdownDiagramPreview from "./markdownDiagramPreview/markdownDiagramPreview";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ApiResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export default function AssistantChatbot() {
  const { orgId, buId, wgId, wId, userName } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your employee assistant. I can help you search for employee information.",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const callEmployeeAPI = async (question: string): Promise<ApiResponse> => {
    try {
      const response = await fetch(
        "https://devtexttosql.ibos.io/search_employee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UnitId: buId,
            intAccountId: orgId,
            intWorkplaceGroupId: wgId,
            intWorkplaceId: wId,
            question: question,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        error:
          "Sorry, I encountered an error while searching for employee information. Please try again.",
      };
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiResponse = await callEmployeeAPI(input);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: apiResponse.success ? apiResponse.data! : apiResponse.error!,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  function stringAvatar(name: string) {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  return (
    <>
      {/* Floating Chat Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={handleClickOpen}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: "var(--primary-color)",
          "&:hover": {
            background: "var(--primary-color-dark)",
            transform: "scale(1.1)",
          },
          transition: "all 0.3s ease-in-out",
          boxShadow: "0 8px 16px rgba(41, 150, 71, 0.3)",
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Chat Dialog */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: isMobile ? "100vh" : "700px",
            maxHeight: isMobile ? "100vh" : "90vh",
            borderRadius: isMobile ? 0 : 2,
            background: "var(--gray100)",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            background: "var(--primary-color)",
            color: "var(--white)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 12px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
              <BotIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div">
                Employee Assistant
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Online
              </Typography>
            </Box>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Messages */}
        <DialogContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: 1,
            background: "var(--gray100)",
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.role === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                {message.role === "assistant" && (
                  <Avatar
                    sx={{
                      bgcolor: "var(--primary-color)",
                      width: 32,
                      height: 32,
                    }}
                  >
                    <BotIcon fontSize="small" />
                  </Avatar>
                )}

                <Paper
                  elevation={2}
                  sx={{
                    padding: 2,
                    maxWidth: "75%",
                    backgroundColor:
                      message.role === "user"
                        ? "var(--primary-color)"
                        : "var(--white)",
                    color:
                      message.role === "user"
                        ? "var(--white)"
                        : "var(--gray900)",
                    borderRadius: 2,
                    borderTopLeftRadius: message.role === "assistant" ? 0 : 2,
                    borderTopRightRadius: message.role === "user" ? 0 : 2,
                  }}
                >
                  {message.role === "assistant" ? (
                    <MarkdownDiagramPreview markdown={message.content} />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        color:
                          message.role === "user"
                            ? "var(--white)"
                            : "var(--gray900)",
                      }}
                    >
                      {message.content}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "right",
                      marginTop: 1,
                      opacity: 0.7,
                      fontSize: "0.7rem",
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Paper>

                {message.role === "user" && (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      textTransform: "uppercase",
                      bgcolor: "var(--primary-color)",
                      fontSize: "0.75rem",
                    }}
                    {...stringAvatar(userName)}
                  ></Avatar>
                )}
              </Box>
            ))}

            {isLoading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: "var(--primary-color)",
                    width: 32,
                    height: 32,
                  }}
                >
                  <BotIcon fontSize="small" />
                </Avatar>
                <Paper
                  elevation={2}
                  sx={{
                    padding: 2,
                    backgroundColor: "var(--white)",
                    borderRadius: 2,
                    borderTopLeftRadius: 0,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Searching employee data...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              padding: 1,
              backgroundColor: "var(--white)",
              borderRadius: 2,
              margin: 1,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={3}
              variant="outlined"
              placeholder="Ask about employees..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    border: "none",
                  },
                },
              }}
            />
            <div>
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                sx={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--white)",
                  "&:hover": {
                    backgroundColor: "var(--primary-color-dark)",
                  },
                  "&:disabled": {
                    backgroundColor: "#e0e0e0",
                    color: "#9e9e9e",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
