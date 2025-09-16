
'use client';

import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from './ui/button';
import { User, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface AutofillUserDataProps {
  onAutofill: () => void;
  disabled?: boolean;
}

export function AutofillUserData({ onAutofill, disabled }: AutofillUserDataProps) {
  const { userProfile, loading } = useUserProfile();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onAutofill}
            disabled={disabled || loading || !userProfile}
            className="h-8 w-8"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <User className="h-4 w-4" />
            )}
            <span className="sr-only">Fill with my profile data</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Fill with my profile data</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
