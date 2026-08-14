import {
  Briefcase,
  Building2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { STATUS_COLORS } from "./constants";
import { initialsFor } from "./utils";

function InfoLine({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 text-sm">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="truncate">{children}</span>
    </div>
  );
}

export function MemberHoverCard({ member, children }) {
  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        asChild
        className="rounded-full border-none bg-transparent p-0"
      >
        {children}
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 p-0">
        <div className="flex items-start gap-3 p-4">
          <div className="relative shrink-0">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-base">
                {initialsFor(member.name)}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-popover ${STATUS_COLORS[member.status]}`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-semibold">{member.name}</div>
            <div className="text-sm text-muted-foreground">{member.title}</div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="gap-1">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${STATUS_COLORS[member.status]}`}
                />
                {member.status}
              </Badge>
              {member.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y border-t">
          <InfoLine icon={Mail}>{member.email}</InfoLine>
          <InfoLine icon={Phone}>{member.phone}</InfoLine>
          <InfoLine icon={MapPin}>{member.location}</InfoLine>
          <InfoLine icon={Clock}>{member.timezone}</InfoLine>
          <InfoLine icon={Building2}>{member.department}</InfoLine>
          <InfoLine icon={Briefcase}>{member.title}</InfoLine>
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3">
          <span className="text-xs text-muted-foreground">
            Member since {member.memberSince}
          </span>
          <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View Profile
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
