import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertaBanner } from "../shared/components/ui";

interface ErrorBoundaryProps {
  children: ReactNode;
  mensaje: string;
}

interface ErrorBoundaryState {
  error: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { error: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error aislado por ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return <AlertaBanner tipo="error" titulo="Sección no disponible" mensaje={this.props.mensaje} />;
    }
    return this.props.children;
  }
}
